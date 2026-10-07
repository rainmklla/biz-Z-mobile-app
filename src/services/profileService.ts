import {
  doc,
  getDoc,
  getFirestore,
  setDoc,
} from '@react-native-firebase/firestore';

export type ProfileDetails = {
  interests: string[];
  personality: string[];
  workingStyle: string[];
  currency: string;
  startingCapital: string;
  monthlyBudget: string;
  location: string;
};

export const EMPTY_DETAILS: ProfileDetails = {
  interests: [],
  personality: [],
  workingStyle: [],
  currency: 'PHP',
  startingCapital: '',
  monthlyBudget: '',
  location: '',
};

const PROFILE_SETUP_MARKER = '__profile_setup_required__';

function parseBudget(value: string, label: string): number {
  const text = value.trim();

  if (!text) {
    throw new Error(`Enter your ${label}. Enter 0 if you have no budget.`);
  }

  // Accept plain numbers such as 30000 or 30000.50.
  if (!/^\d+(\.\d{1,2})?$/.test(text)) {
    throw new Error(
      `${label} must be a number without commas, with up to two decimal places.`,
    );
  }

  const amount = Number(text);

  if (!Number.isFinite(amount) || amount > 1000000000) {
    throw new Error(`${label} must not exceed 1,000,000,000.`);
  }

  return amount;
}

export async function saveUserProfile(
  userId: string,
  displayName: string,
  background?: string,
  details?: ProfileDetails,
) {
  const name = displayName.trim();

  if (!name || name.length > 100) {
    throw new Error('Enter a name between 1 and 100 characters.');
  }

  const profile: {
    displayName: string;
    background?: string;
    interests?: string[];
    personality?: string[];
    workingStyle?: string[];
    currency?: string;
    startingCapital?: number;
    monthlyBudget?: number;
    location?: string;
  } = {
    displayName: name,
  };

  if (background !== undefined) {
    if (background.trim().length > 2000) {
      throw new Error('Background must not exceed 2,000 characters.');
    }

    profile.background = background.trim();
  }

  if (details !== undefined) {
    const location = details.location.trim();

    if (location.length > 200) {
      throw new Error('Location must not exceed 200 characters.');
    }

    profile.interests = details.interests;
    profile.personality = details.personality;
    profile.workingStyle = details.workingStyle;
    profile.currency = details.currency;

    profile.startingCapital = parseBudget(
      details.startingCapital,
      'starting capital',
    );

    profile.monthlyBudget = parseBudget(
      details.monthlyBudget,
      'monthly budget',
    );

    profile.location = location;
  }

  await setDoc(
    doc(getFirestore(), 'users', userId),
    profile,
    { merge: true },
  );
}

function readChoices(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(
    (item): item is string => typeof item === 'string',
  );
}

function readBudget(value: unknown): string {
  return typeof value === 'number' && Number.isFinite(value)
    ? String(value)
    : '';
}

export async function setProfileSetupRequired(userId: string) {
  await setDoc(
    doc(getFirestore(), 'users', userId),
    { displayName: PROFILE_SETUP_MARKER },
    { merge: true },
  );
}

export async function loadUserProfile(userId: string) {
  const snapshot = await getDoc(
    doc(getFirestore(), 'users', userId),
  );

  const data = snapshot.data();

  const details: ProfileDetails = {
    interests: readChoices(data?.interests),
    personality: readChoices(data?.personality),
    workingStyle: readChoices(data?.workingStyle),
    currency:
      typeof data?.currency === 'string' ? data.currency : 'PHP',
    startingCapital: readBudget(data?.startingCapital),
    monthlyBudget: readBudget(data?.monthlyBudget),
    location:
      typeof data?.location === 'string' ? data.location : '',
  };

  return {
    profileSetupRequired: data?.displayName === PROFILE_SETUP_MARKER,
    displayName:
      typeof data?.displayName === 'string' && data.displayName !== PROFILE_SETUP_MARKER
        ? data.displayName
        : '',
    background:
      typeof data?.background === 'string' ? data.background : '',
    details,
  };
}