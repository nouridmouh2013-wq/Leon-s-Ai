import { getApp, getApps, initializeApp } from "firebase/app";
import {
  browserLocalPersistence,
  getAuth,
  getRedirectResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  type User,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY?.trim() ?? "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN?.trim() ?? "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID?.trim() ?? "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID?.trim() ?? "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID?.trim() || undefined,
};

export const firebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.authDomain &&
  firebaseConfig.projectId &&
  firebaseConfig.appId,
);

const app = firebaseConfigured
  ? getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig)
  : null;

export const firebaseAuth = app ? getAuth(app) : null;

export function watchFirebaseUser(
  onChange: (user: User | null) => void,
  onError: (error: Error) => void,
): () => void {
  if (!firebaseAuth) {
    onChange(null);
    return () => undefined;
  }
  return onAuthStateChanged(firebaseAuth, onChange, onError);
}

export async function finishGoogleRedirect() {
  if (firebaseAuth) await getRedirectResult(firebaseAuth);
}

export async function signInWithGoogle() {
  if (!firebaseAuth) throw new Error("FIREBASE_NOT_CONFIGURED");
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  await setPersistence(firebaseAuth, browserLocalPersistence);
  const isMobile = typeof navigator !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    await signInWithRedirect(firebaseAuth, provider);
  } else {
    await signInWithPopup(firebaseAuth, provider);
  }
}

export async function signOutFromGoogle() {
  if (firebaseAuth) await signOut(firebaseAuth);
}

export async function getFirebaseIdToken(): Promise<string | null> {
  const user = firebaseAuth?.currentUser;
  return user ? user.getIdToken() : null;
}
