import { Request, Response } from 'express';
import * as FirebaseAuthService from '../../infrastructure/services/FirebaseAuthService';
import * as UserRepository from '../../infrastructure/repositories/UserRepository';

export const registerController = async (req: Request, res: Response) => {
  try {
    const user = await FirebaseAuthService.register(req.body.email, req.body.password);
    res.json({ data: user });
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message || 'Registration failed' } });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const token = await FirebaseAuthService.login(req.body.email, req.body.password);
    res.json({ data: token });
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message || 'Login failed' } });
  }
};

export const logoutController = async (req: Request, res: Response) => {
  try {
    // Clear session cookie
    res.clearCookie('session', { path: '/' });
    await FirebaseAuthService.logout(req);
    res.json({ data: 'ok' });
  } catch (err: any) {
    res.status(400).json({ error: { message: err.message || 'Logout failed' } });
  }
};

export const meController = async (req: Request, res: Response) => {
  try {
    const userRecord = await FirebaseAuthService.getUserFromRequest(req);
    // Ensure user exists in app DB
    const user = await UserRepository.findOrCreateUser({
      uid: (userRecord as any).uid,
      email: (userRecord as any).email,
      displayName: (userRecord as any).displayName,
    });
    res.json({ data: user });
  } catch (err: any) {
    res.status(401).json({ error: { message: err.message || 'Unauthorized' } });
  }
};

// Provide PascalCase aliases expected by existing tests
export const RegisterController = registerController;
export const LoginController = loginController;
export const LogoutController = logoutController;
export const MeController = meController;
