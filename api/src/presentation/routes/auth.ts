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
    if (!idToken) return res.status(400).json({ error: { message: 'Missing idToken' } });

    const expiresIn = 5 * 24 * 60 * 60 * 1000; // 5 days
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
    console.error('[POST /api/auth/session]', err);
    return res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
  }
});

// POST /api/auth/logout
router.post('/logout', logoutController);

// GET /api/auth/me
router.get('/me', meController);

export default router;
