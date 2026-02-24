import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
  signOut,
} from 'firebase/auth';

// Client-side Firebase initialization for Next.js
const clientFirebaseConfig =
  typeof window !== 'undefined' && (globalThis as any).__FIREBASE_CONFIG
    ? (globalThis as any).__FIREBASE_CONFIG
    : undefined;

const firebaseConfig = clientFirebaseConfig ?? {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: ReturnType<typeof initializeApp> | undefined;
let auth: ReturnType<typeof getAuth> | undefined;
let initializing = false;

async function initFirebase(): Promise<void> {
  if (auth && app) return;
  if (initializing) {
    // wait for existing init to complete
    return new Promise((resolve) => {
      const check = () => {
        if (auth && app) resolve(undefined);
        else setTimeout(check, 50);
      };
      check();
    });
  }

  initializing = true;

  try {
    // if apiKey missing, fetch server route that returns env (fallback)
    if (!firebaseConfig.apiKey && typeof window !== 'undefined') {
      try {
        const res = await fetch('/api/firebase-config');
        if (res.ok) {
          const json = await res.json();
          const data = json?.data ?? {};
          firebaseConfig.apiKey = data.apiKey ?? firebaseConfig.apiKey;
          firebaseConfig.authDomain = data.authDomain ?? firebaseConfig.authDomain;
          firebaseConfig.projectId = data.projectId ?? firebaseConfig.projectId;
          firebaseConfig.appId = data.appId ?? firebaseConfig.appId;
        }
      } catch (e) {
        // ignore fetch errors; will surface Init error later
      }
    }

    console.log('firebaseConfig (post-fetch)', firebaseConfig);

    if (!getApps().length) {
      if (!firebaseConfig.apiKey) {
        throw new Error('Missing Firebase apiKey');
      }
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }

    auth = getAuth(app);
  } finally {
    initializing = false;
  }
}

export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const signInWithProvider = async (
  provider: GoogleAuthProvider | GithubAuthProvider
): Promise<{ idToken: string }> => {
  if (typeof window === 'undefined') {
    throw new Error('Firebase auth is only available in the browser');
  }

  await initFirebase();

  if (!auth) throw new Error('Firebase auth not initialized');

  try {
    const result = await signInWithPopup(auth, provider);
    const idToken = await result.user.getIdToken();
    return { idToken };
  } catch (error) {
    throw error;
  }
};

export const signOutClient = async (): Promise<void> => {
  if (typeof window === 'undefined') return;
  await initFirebase();
  if (!auth) return;
  await signOut(auth);
};
