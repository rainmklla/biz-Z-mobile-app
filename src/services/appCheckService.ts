import { getApp } from '@react-native-firebase/app';
import {
  initializeAppCheck,
  ReactNativeFirebaseAppCheckProvider,
} from '@react-native-firebase/app-check';

async function initialize() {
  const provider = new ReactNativeFirebaseAppCheckProvider();

  if (__DEV__) {
    const debugToken =
      process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN?.trim();

    if (!debugToken) {
      throw new Error('App Check debug token is missing from .env.local.');
    }

    provider.configure({
      android: {
        provider: 'debug',
        debugToken,
      },
    });
  } else {
    provider.configure({
      android: {
        provider: 'playIntegrity',
      },
    });
  }

  return initializeAppCheck(getApp(), {
    provider,
    isTokenAutoRefreshEnabled: true,
  });
}

let initialization: ReturnType<typeof initialize> | undefined;

export function setupAppCheck() {
  if (!initialization) {
    initialization = initialize().catch(error => {
      initialization = undefined;
      throw error;
    });
  }

  return initialization;
}