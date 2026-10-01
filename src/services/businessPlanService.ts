import {
  doc,
  getDoc,
  getFirestore,
  runTransaction,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import type { BusinessIdea } from './businessIdeaService';

export type SelectedBusiness = {
  idea: BusinessIdea;
  currency: string;
  workspaceId?: string;
};

export type SaveSelectionResult = {
  selection: SelectedBusiness;
  alreadySelected: boolean;
};

const CURRENCIES = [
  'PHP', 'USD', 'EUR', 'GBP', 'JPY', 'SGD',
  'AUD', 'CAD', 'HKD', 'CNY', 'KRW', 'INR',
  'MYR', 'THB', 'IDR', 'VND',
];

function readText(
  value: unknown,
  label: string,
  maxLength: number,
): string {
  if (
    typeof value !== 'string' ||
    !value.trim() ||
    value.length > maxLength
  ) {
    throw new Error(`The business idea has an invalid ${label}.`);
  }

  return value.trim();
}

function readCost(value: unknown): number {
  if (
    typeof value !== 'number' ||
    !Number.isFinite(value) ||
    value < 0 ||
    value > 1000000000
  ) {
    throw new Error('The business idea has an invalid cost estimate.');
  }

  return value;
}

function parseSelection(value: unknown): SelectedBusiness {
  if (!value || typeof value !== 'object') {
    throw new Error('Unable to read the selected business.');
  }

  const data = value as Record<string, unknown>;

  if (!data.idea || typeof data.idea !== 'object') {
    throw new Error('The selected business is missing its idea.');
  }

  if (
    typeof data.currency !== 'string' ||
    !CURRENCIES.includes(data.currency)
  ) {
    throw new Error('The selected business has an invalid currency.');
  }

  const idea = data.idea as Record<string, unknown>;

  return {
    currency: data.currency,
    workspaceId: data.selectedAt && typeof data.selectedAt === 'object' && 'seconds' in data.selectedAt && 'nanoseconds' in data.selectedAt
      ? `${data.selectedAt.seconds}-${data.selectedAt.nanoseconds}` : undefined,
    idea: {
      title: readText(idea.title, 'title', 300),
      industry: readText(idea.industry, 'industry', 200),
      overview: readText(idea.overview, 'overview', 4000),
      whyItFits: readText(idea.whyItFits, 'explanation', 4000),
      estimatedStartupCost: readCost(idea.estimatedStartupCost),
      estimatedMonthlyCost: readCost(idea.estimatedMonthlyCost),
      assumptions: readText(idea.assumptions, 'assumptions', 4000),
      firstStep: readText(idea.firstStep, 'first step', 4000),
    },
  };
}

function getPlanReference(userId: string) {
  if (!userId) {
    throw new Error('Please sign in before opening your business plan.');
  }

  return doc(
    getFirestore(),
    'users',
    userId,
    'businessPlans',
    'current',
  );
}

export async function loadSelectedBusiness(
  userId: string,
): Promise<SelectedBusiness | null> {
  const snapshot = await getDoc(getPlanReference(userId));
  const data = snapshot.data();

  return data === undefined ? null : parseSelection(data);
}

export async function saveSelectedBusiness(
  userId: string,
  idea: BusinessIdea,
  currency: string,
  replaceExisting = false,
): Promise<SaveSelectionResult> {
  const reference = getPlanReference(userId);
  const selection = parseSelection({ idea, currency });

  const result = await runTransaction(getFirestore(), async transaction => {
    const snapshot = await transaction.get(reference);
    const existing = snapshot.data();

    // Preserve an existing choice unless replacement was confirmed.
    if (existing !== undefined && !replaceExisting) {
      return {
        selection: parseSelection(existing),
        alreadySelected: true,
      };
    }

    transaction.set(reference, {
      idea: selection.idea,
      currency: selection.currency,
      selectedAt: serverTimestamp(),
    });

    return {
      selection,
      alreadySelected: false,
    };
  });
  const saved = await loadSelectedBusiness(userId);
  return { ...result, selection: saved ?? result.selection };
}
