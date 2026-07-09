import { auth } from './firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

export const registerUser = async (email: string, password: string) => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const login = async (email: string, password: string) => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  return cred.user;
};

export const logOut = async () => {
  await signOut(auth);
};