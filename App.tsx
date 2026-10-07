import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Button,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  getAuth,
  onAuthStateChanged,
} from '@react-native-firebase/auth';

import { setupAppCheck } from './src/services/appCheckService';
import {
  registerUser,
  loginUser,
  logoutUser,
  sendVerificationEmail,
  refreshEmailVerification,
} from './src/services/authService';
import {
  EMPTY_DETAILS,
  loadUserProfile,
  saveUserProfile,
  setProfileSetupRequired,
} from './src/services/profileService';
import type { ProfileDetails } from './src/services/profileService';
import { generateBusinessIdeas } from './src/services/businessIdeaService';
import type {
  BusinessIdea,
  BusinessRecommendations,
} from './src/services/businessIdeaService';
import {
  loadSelectedBusiness,
  saveSelectedBusiness,
} from './src/services/businessPlanService';
import type { SelectedBusiness } from './src/services/businessPlanService';

import LandingScreen from './src/screens/LandingScreen';
import AuthScreen from './src/screens/AuthScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import { profileError as validateProfile } from './src/data/profileValidation';
import { Brand, Action } from './src/ui/BizUI';
import { colors } from './src/ui/theme';
import { useBizDialog } from './src/ui/BizDialog';

type AuthUser = ReturnType<typeof getAuth>['currentUser'];

function message(error: unknown) {
  return error instanceof Error ? error.message : 'Please try again.';
}

function useAppState() {
  const router = useRouter();
  const { showDialog } = useBizDialog();

  const [user, setUser] = useState<AuthUser>(null);
  const [emailVerified, setEmailVerified] = useState(false);
  const [initializing, setInitializing] = useState(true);
  const [startupError, setStartupError] = useState('');
  const [startupRetry, setStartupRetry] = useState(0);

  const [registering, setRegistering] = useState(false);
  const [showLanding, setShowLanding] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [displayName, setDisplayName] = useState('');
  const [background, setBackground] = useState('');
  const [details, setDetails] = useState<ProfileDetails>(EMPTY_DETAILS);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState('');
  const [profileRetry, setProfileRetry] = useState(0);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  const [recommendations, setRecommendations] =
    useState<BusinessRecommendations | null>(null);
  const [selectedBusiness, setSelectedBusiness] =
    useState<SelectedBusiness | null>(null);

  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [selecting, setSelecting] = useState(false);

  const operation = useRef(false);
  const confirmationOpen = useRef(false);
  const registrationPending = useRef(false);
  const pendingNewAccountId = useRef('');

  useEffect(() => {
    let active = true;
    let unsubscribe: (() => void) | undefined;

    setInitializing(true);
    setStartupError('');

    setupAppCheck()
      .then(() => {
        if (!active) return;

        unsubscribe = onAuthStateChanged(getAuth(), currentUser => {
          if (!active) return;

          setUser(currentUser);
          setEmailVerified(currentUser?.emailVerified ?? false);
          setInitializing(false);
          setProfileLoading(!!currentUser);
          setProfileError('');
          setDisplayName('');
          setBackground('');
          setDetails(EMPTY_DETAILS);
          setPassword('');
          setRecommendations(null);
          setSelectedBusiness(null);
          setOnboardingComplete(false);
        });
      })
      .catch(error => {
        if (active) {
          setStartupError(message(error));
          setInitializing(false);
        }
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, [startupRetry]);

  const userId = user?.uid;

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;
    setProfileLoading(true);
    setProfileError('');

    Promise.all([
      loadUserProfile(userId),
      loadSelectedBusiness(userId),
    ])
      .then(([profile, selection]) => {
        if (cancelled) return;

        setDisplayName(profile.displayName);
        setBackground(profile.background);
        setDetails(profile.details);
        setSelectedBusiness(selection);
        // Only accounts explicitly marked during registration must complete setup.
        setOnboardingComplete(
          !profile.profileSetupRequired &&
            !registrationPending.current &&
            pendingNewAccountId.current !== userId,
        );
      })
      .catch(error => {
        if (!cancelled) setProfileError(message(error));
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId, profileRetry]);

  async function submitAccount() {
    if (operation.current) return;

    if (!email.trim() || !password) {
      showDialog('Missing details', 'Enter your email and password.');
      return;
    }

    operation.current = true;
    setBusy(true);

    try {
      if (registering) {
        registrationPending.current = true;
        try {
          const credential = await registerUser(email, password);
          pendingNewAccountId.current = credential.user.uid;
          await setProfileSetupRequired(credential.user.uid);
        } finally {
          registrationPending.current = false;
        }
        try {
          await sendVerificationEmail();
        } catch (error) {
          showDialog(
            'Account created',
            `We couldn’t send the verification email. You can try again from the verification screen. ${message(error)}`,
          );
        }
      } else {
        registrationPending.current = false;
        pendingNewAccountId.current = '';
        await loginUser(email, password);
      }

      setPassword('');
      router.replace('/');
    } catch (error) {
      showDialog(
        registering ? 'Registration failed' : 'Login failed',
        message(error),
      );
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  async function checkEmailVerification() {
    const verified = await refreshEmailVerification();
    setEmailVerified(verified);
    return verified;
  }

  async function saveProfile() {
    if (!user || operation.current) return false;
    const validation = validateProfile({ displayName, background, details });
    if (validation) { showDialog('A little more about you', validation); return false; }

    const uid = user.uid;
    operation.current = true;
    setBusy(true);

    try {
      await saveUserProfile(uid, displayName, background, details);

      if (getAuth().currentUser?.uid === uid) {
        pendingNewAccountId.current = '';
        setOnboardingComplete(true);
        showDialog('Profile saved', 'Your profile has been updated.');
        return true;
      }
      return false;
    } catch (error) {
      if (getAuth().currentUser?.uid === uid) {
        showDialog('Unable to save', message(error));
      }
      return false;
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  async function exploreIdeas() {
    if (!user || operation.current) return;

    const validation = validateProfile({ displayName, background, details });
    if (validation) {
      router.navigate('/profile');
      showDialog(
        'Complete your profile',
        `${validation} Open Edit my profile to update your answers.`,
      );
      return;
    }

    const uid = user.uid;
    Keyboard.dismiss();
    operation.current = true;
    setGenerating(true);
    router.navigate('/ideas');

    try {
      await saveUserProfile(uid, displayName, background, details);

      if (getAuth().currentUser?.uid !== uid) return;

      const result = await generateBusinessIdeas(uid);

      if (getAuth().currentUser?.uid === uid) {
        setRecommendations(result);
      }
    } catch (error) {
      if (getAuth().currentUser?.uid === uid) {
        showDialog('Unable to generate ideas', message(error));
      }
    } finally {
      operation.current = false;
      setGenerating(false);
    }
  }

  async function confirmSelection(
    uid: string,
    idea: BusinessIdea,
    currency: string,
    replaceExisting: boolean,
  ) {
    if (
      operation.current ||
      getAuth().currentUser?.uid !== uid
    ) {
      return;
    }

    operation.current = true;
    setSelecting(true);

    try {
      const result = await saveSelectedBusiness(
        uid,
        idea,
        currency,
        replaceExisting,
      );

      if (getAuth().currentUser?.uid !== uid) return;

      setSelectedBusiness(result.selection);

      // Keep the recommendation list available in the Ideas tab.
      router.navigate('/');

      if (result.alreadySelected) {
        showDialog(
          'Existing business loaded',
          'A business was already saved. Open Ideas to choose a replacement.',
        );
      } else {
        showDialog('Business saved', 'Your selected business is ready.');
      }
    } catch (error) {
      if (getAuth().currentUser?.uid === uid) {
        showDialog('Unable to save your choice', message(error));
      }
    } finally {
      operation.current = false;
      setSelecting(false);
    }
  }

  function chooseIdea(idea: BusinessIdea) {
    if (
      !user ||
      !recommendations ||
      operation.current ||
      confirmationOpen.current
    ) {
      return;
    }

    const uid = user.uid;
    const currency = recommendations.currency;
    const replacing = selectedBusiness !== null;

    confirmationOpen.current = true;

    showDialog(
      replacing ? 'Replace your business?' : 'Choose this business?',
      selectedBusiness
        ? `"${idea.title}" will replace "${selectedBusiness.idea.title}".`
        : `"${idea.title}" will become the focus of your business plan.`,
      [
        {
          text: 'Keep comparing',
          style: 'cancel',
          onPress: () => {
            confirmationOpen.current = false;
          },
        },
        {
          text: replacing ? 'Replace business' : 'Confirm choice',
          onPress: () => {
            confirmationOpen.current = false;
            void confirmSelection(uid, idea, currency, replacing);
          },
        },
      ],
      { cancelable: false },
    );
  }

  async function logOut() {
    if (operation.current) return;

    operation.current = true;
    setBusy(true);

    try {
      await logoutUser();
      registrationPending.current = false;
      pendingNewAccountId.current = '';
      setEmail('');
      setPassword('');
      setRegistering(false);
      setShowLanding(true);
      setRecommendations(null);
      setSelectedBusiness(null);
      router.replace('/');
    } catch (error) {
      showDialog('Unable to log out', message(error));
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  async function finishPasswordReset(accountEmail: string) {
    if (operation.current) return;

    operation.current = true;
    setBusy(true);

    try {
      if (getAuth().currentUser) {
        await logoutUser();
      }

      setEmail(accountEmail);
      setPassword('');
      setRegistering(false);
      setShowLanding(false);
      router.replace('/');
    } catch {
      showDialog(
        'Password already updated',
        'Unable to return to login. Please try Go to login again.',
      );
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }

  function cancelPasswordReset() {
    setPassword('');
    setRegistering(false);
    setShowLanding(false);
    router.replace('/');
  }

  return {
    user,
    emailVerified,
    initializing,
    startupError,
    retryStartup: () => setStartupRetry(value => value + 1),
    profileLoading,
    profileError,
    retryProfile: () => setProfileRetry(value => value + 1),
    registering,
    setRegistering,
    showLanding,
    setShowLanding,
    email,
    setEmail,
    password,
    setPassword,
    displayName,
    setDisplayName,
    background,
    setBackground,
    details,
    setDetails,
    recommendations,
    selectedBusiness,
    onboardingComplete,
    busy,
    generating,
    selecting,
    working: busy || generating || selecting,
    submitAccount,
    sendVerificationEmail,
    checkEmailVerification,
    saveProfile,
    exploreIdeas,
    chooseIdea,
    logOut,
    finishPasswordReset,
    cancelPasswordReset,
  };
}

type AppState = ReturnType<typeof useAppState>;

const AppContext = createContext<AppState | null>(null);

export default function App({ children }: React.PropsWithChildren) {
  const state = useAppState();

  return (
    <AppContext.Provider value={state}>
      {children}
    </AppContext.Provider>
  );
}

export function useBusinessApp() {
  const state = useContext(AppContext);

  if (!state) {
    throw new Error('The screen must be inside the app provider.');
  }

  return state;
}

export function AccountGate({ children }: React.PropsWithChildren) {
  const app = useBusinessApp();

  if (app.initializing || (app.user && app.profileLoading)) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#245c42" />
        <Text style={styles.body}>Loading your account…</Text>
      </View>
    );
  }

  if (app.startupError || (app.user && app.profileError)) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {app.startupError || app.profileError}
        </Text>
        <Button
          title="Try again"
          color="#245c42"
          onPress={
            app.startupError ? app.retryStartup : app.retryProfile
          }
          disabled={app.working}
        />
        {!!app.user && (
          <Button
            title="Log out"
            color="#666666"
            onPress={app.logOut}
            disabled={app.working}
          />
        )}
      </View>
    );
  }

  if (app.user && !app.emailVerified) {
    return (
      <SafeAreaView style={styles.screen}>
        <VerifyEmailScreen
          email={app.user.email ?? ''}
          onResend={app.sendVerificationEmail}
          onCheck={app.checkEmailVerification}
          onSignOut={app.logOut}
        />
      </SafeAreaView>
    );
  }

  if (!app.user && app.showLanding) {
    return (
      <SafeAreaView style={styles.screen}>
        <LandingScreen
          onGetStarted={() => {
            app.setRegistering(true);
            app.setShowLanding(false);
          }}
          onLogin={() => {
            app.setRegistering(false);
            app.setShowLanding(false);
          }}
        />
      </SafeAreaView>
    );
  }

  if (!app.user) {
    return (
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.auth}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={{ marginBottom: 28 }}><Brand /></View>
          <AuthScreen
            registering={app.registering}
            email={app.email}
            password={app.password}
            busy={app.working}
            onChangeEmail={app.setEmail}
            onChangePassword={app.setPassword}
            onSubmit={app.submitAccount}
            onToggleMode={() => {
              app.setRegistering(!app.registering);
              app.setPassword('');
            }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!app.onboardingComplete) {
    return <SafeAreaView style={styles.screen}>
      <View style={{ paddingHorizontal: 22, paddingTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}><Brand /><Action title="Sign out" variant="quiet" onPress={app.logOut} disabled={app.working} /></View>
      <ProfileScreen email={app.user.email ?? ''} displayName={app.displayName} background={app.background} details={app.details} busy={app.working} onChangeName={app.setDisplayName} onChangeBackground={app.setBackground} onChangeDetails={app.setDetails} onSave={() => { void app.saveProfile(); }} />
    </SafeAreaView>;
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 16,
    backgroundColor: colors.background,
  },
  auth: {
    flexGrow: 1,
    padding: 24,
  },
  brand: {
    color: '#245c42',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 28,
  },
  body: {
    color: '#596c62',
  },
  error: {
    color: '#b3261e',
    textAlign: 'center',
  },
});
