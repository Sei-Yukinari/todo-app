import { Request, Response, NextFunction } from 'express';
import * as FirebaseAuthService from '../infrastructure/services/FirebaseAuthService';

// Express middleware to verify Firebase session cookie and attach user to req
export const verifyAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await FirebaseAuthService.getUserFromRequest(req as any);
    // attach user to request for downstream handlers
    (req as any).user = user;
    return next();
  } catch (err: any) {
    console.error('[auth middleware] Unauthorized', err?.message ?? err);
    return res.status(401).json({ error: { message: 'Unauthorized' } });
  }
};

export default verifyAuth;
