import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
} from '@react-native-firebase/auth';

export function registerUser(email: string, password: string) {
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