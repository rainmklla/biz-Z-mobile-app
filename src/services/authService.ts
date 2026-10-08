import {
  createUserWithEmailAndPassword,
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';
import { validatePassword } from './passwordPolicy';

export function registerUser(email: string, password: string) {
  const passwordError = validatePassword(password);
  if (passwordError) return Promise.reject(new Error(passwordError));

  return createUserWithEmailAndPassword(
    getAuth(),
    email.trim(),
    password,
  );
}

export function loginUser(email: string, password: string) {
  return signInWithEmailAndPassword(
    getAuth(),
    email.trim(),
    password,
  );
}

export function logoutUser() {
  return signOut(getAuth());
}

export function sendVerificationEmail() {
  const user = getAuth().currentUser;
  if (!user) throw new Error('You are not signed in. Please sign in again.');
  return sendEmailVerification(user);
}

export async function refreshEmailVerification() {
  const user = getAuth().currentUser;
  if (!user) return false;
  await user.reload();
  return user.emailVerified;
}
