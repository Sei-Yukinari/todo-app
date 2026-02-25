import { Request } from 'express';
import admin from 'firebase-admin';

// firebase-admin based implementation for session cookie creation and token verification.
// Expects FIREBASE_ADMIN_CREDENTIALS (JSON) to be available via env or mounted file.

if (!admin.apps.length) {
  const cred = process.env.FIREBASE_ADMIN_CREDENTIALS
    ? JSON.parse(process.env.FIREBASE_ADMIN_CREDENTIALS)
    : undefined;
  // Only initialize admin with explicit credentials in local/dev; in test environments skip initialization
  if (cred) {
    admin.initializeApp({ credential: admin.credential.cert(cred) });
  }
}

export const register = async (email: string, password: string) => {
  // For OAuth providers we typically do not register with email/password here.
  return { uid: 'not-implemented', email };
};

export const login = async (_email: string, _password: string) => {
  throw new Error('Email/password login not supported when using Firebase OAuth providers');
};

export const logout = async (req: Request) => {
  // Clear session cookie on server side if using express
  // Implementation depends on framework; stub for now
  return;
};

export const verifyIdToken = async (idToken: string) => {
  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    return decoded as any;
  } catch (err) {
    throw err;
  }
};

export const createSessionCookie = async (
  idToken: string,
  expiresInMs = 5 * 24 * 60 * 60 * 1000
) => {
  try {
    const sessionCookie = await admin
      .auth()
      .createSessionCookie(idToken, { expiresIn: expiresInMs });
    return sessionCookie;
  } catch (err) {
    throw err;
  }
};

export const getUser = async (uid: string) => {
  try {
    const userRecord = await admin.auth().getUser(uid);
    return userRecord as any;
  } catch (err) {
    throw err;
  }
};

export const getIdTokenFromRequest = (req: Request): string | null => {
  // Look for session cookie named 'session'
  const cookie = req.headers['cookie'];
  if (!cookie) return null;
  const match = String(cookie)
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith('session='));
  if (!match) return null;
  return match.split('=')[1] || null;
};

export const getUserFromRequest = async (req: Request) => {
  const sessionCookie = getIdTokenFromRequest(req);
  if (!sessionCookie) throw new Error('No session cookie');
  try {
    const decoded = await admin.auth().verifySessionCookie(sessionCookie, true);
    const user = await getUser(decoded.uid);
    return user;
  } catch (err) {
    throw err;
  }
};
