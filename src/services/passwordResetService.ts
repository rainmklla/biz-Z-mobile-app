import {
  confirmPasswordReset,
  getAuth,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from '@react-native-firebase/auth';

function getErrorCode(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    return String(error.code);
  }

  return '';
}

export async function requestPasswordReset(email: string): Promise<void> {
  const address = email.trim();

  if (!address) {
    throw new Error('Enter your email address first.');
  }

  try {
    await sendPasswordResetEmail(getAuth(), address);
  } catch (error) {
    const code = getErrorCode(error);

    // Keep the response the same whether an account exists or not.
    if (code === 'auth/user-not-found') {
      return;
    }

    if (code === 'auth/invalid-email') {
      throw new Error('Enter a valid email address.');
    }

    if (code === 'auth/too-many-requests') {
      throw new Error('Too many requests. Please wait before trying again.');
    }

    if (code === 'auth/network-request-failed') {
      throw new Error('Check your internet connection and try again.');
    }

    throw new Error('Unable to send the reset email. Please try again.');
  }
}

export async function checkPasswordResetLink(
  code: string,
): Promise<string> {
  if (!code.trim()) {
    throw new Error('This reset link is missing its verification code.');
  }

  try {
    // Firebase returns the email belonging to this reset code.
    return await verifyPasswordResetCode(getAuth(), code);
  } catch (error) {
    const errorCode = getErrorCode(error);

    if (
      errorCode === 'auth/expired-action-code' ||
      errorCode === 'auth/invalid-action-code'
    ) {
      throw new Error(
        'This reset link has expired or is no longer valid. Request a new one.',
      );
    }

    if (errorCode === 'auth/network-request-failed') {
      throw new Error('Check your internet connection and reopen the link.');
    }

    throw new Error('Unable to verify this link. Please request a new one.');
  }
}

export async function completePasswordReset(
  code: string,
  password: string,
  confirmation: string,
): Promise<void> {
  if (!code.trim()) {
    throw new Error('Please open a valid password-reset email link.');
  }

  if (!password) {
    throw new Error('Enter a new password.');
  }

  if (password !== confirmation) {
    throw new Error('The passwords do not match.');
  }

  try {
    // Firebase validates the code again and enforces its password policy.
    await confirmPasswordReset(getAuth(), code, password);
  } catch (error) {
    const errorCode = getErrorCode(error);

    if (
      errorCode === 'auth/weak-password' ||
      errorCode === 'auth/password-does-not-meet-requirements'
    ) {
      throw new Error(
        'Choose a stronger password that meets the account password requirements.',
      );
    }

    if (
      errorCode === 'auth/expired-action-code' ||
      errorCode === 'auth/invalid-action-code'
    ) {
      throw new Error(
        'This reset link has expired or was already used. Request a new one.',
      );
    }

    if (errorCode === 'auth/network-request-failed') {
      throw new Error('Check your internet connection and try again.');
    }

    throw new Error('Unable to reset your password. Please try again.');
  }
}