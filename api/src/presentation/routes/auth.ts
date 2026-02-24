import express from 'express';
import { registerController, loginController, logoutController, meController } from '../controllers/AuthControllers';
import * as FirebaseAuthService from '../../infrastructure/services/FirebaseAuthService';

const router = express.Router();

// POST /api/auth/register
router.post('/register', registerController);

// POST /api/auth/login
router.post('/login', loginController);

// POST /api/auth/session - exchange ID token for session cookie
router.post('/session', async (req, res) => {
  try {
    const { idToken } = req.body;
    // Log minimal info for debugging without exposing tokens
    console.log('[POST /api/auth/session] received body keys=', Object.keys(req.body));
    console.log('[POST /api/auth/session] idToken present=', !!idToken, 'length=', idToken ? idToken.length : 0);
    if (idToken && typeof idToken === 'string') {
      console.log('[POST /api/auth/session] idToken prefix=', idToken.slice(0, 10));
    }
    // quick debug: echo back a hint header when idToken is missing/invalid
    if (!idToken) return res.status(400).set('X-Auth-Debug', 'missing-idToken').json({ error: { message: 'Missing idToken' } });

    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days

    // Development convenience: accept a special 'fake' idToken to create a local session without Firebase.
    if (process.env.NODE_ENV !== 'production' && idToken === 'fake') {
      console.log('[POST /api/auth/session] creating fake session for dev');
      const fakeSession = 'dev-session-' + Date.now();
      res.cookie('session', fakeSession, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: expiresIn,
        path: '/',
      });
      return res.json({ data: { message: 'Session created (dev stub)' } });
    }

    const sessionCookie = await FirebaseAuthService.createSessionCookie(idToken, expiresIn);

    // Set cookie
    res.cookie('session', sessionCookie, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: expiresIn,
      path: '/',
    });

    return res.json({ data: { message: 'Session created' } });
  } catch (err: any) {
    console.error('[POST /api/auth/session]', err && err.stack ? err.stack : err);
    const msg = err?.message || '';
    // Map common firebase-admin token errors to clearer statuses for the client
    if (typeof msg === 'string' && (msg.includes('not a valid Firebase ID token') || msg.includes('Firebase ID token has expired'))) {
      res.set('X-Auth-Debug', 'invalid-idToken');
      return res.status(401).json({ error: { message: msg } });
    }
    return res.status(500).json({ error: { message: msg || 'Internal Server Error' } });
  }
});

// POST /api/auth/logout
router.post('/logout', logoutController);

// GET /api/auth/me
router.get('/me', meController);

export default router;
