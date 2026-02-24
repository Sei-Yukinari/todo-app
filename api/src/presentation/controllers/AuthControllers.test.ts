import {
  RegisterController,
  LoginController,
  LogoutController,
  MeController,
} from './AuthControllers';
import * as FirebaseAuthService from '../../infrastructure/services/FirebaseAuthService';
import * as UserRepository from '../../infrastructure/repositories/UserRepository';
import { Request, Response } from 'express';

vi.mock('../../infrastructure/services/FirebaseAuthService');
vi.mock('../../infrastructure/repositories/UserRepository', () => ({
  findOrCreateUser: vi.fn().mockResolvedValue({ id: 1, uid: '123', email: 'test@example.com' }),
}));

describe.skip('AuthControllers', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: vi.Mock;
  let jsonMock: vi.Mock;

  beforeEach(() => {
    req = { body: {}, headers: {} };
    jsonMock = vi.fn();
    statusMock = vi.fn(() => ({ json: jsonMock }));
    res = { status: statusMock } as any;
    vi.clearAllMocks();
  });

  describe('RegisterController', () => {
    it('registers successfully', async () => {
      req.body = { email: 'test@example.com', password: 'pass' };
      (FirebaseAuthService.register as vi.Mock).mockResolvedValue({
        uid: '123',
        email: 'test@example.com',
      });
      await RegisterController(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ data: { uid: '123', email: 'test@example.com' } });
    });
    it('returns 400 if missing fields', async () => {
      req.body = { email: '' };
      await RegisterController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email and password are required.' });
    });
    it('handles registration error', async () => {
      req.body = { email: 'fail@example.com', password: 'pass' };
      (FirebaseAuthService.register as vi.Mock).mockRejectedValue(
        new Error('Registration failed.')
      );
      await RegisterController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Registration failed.' });
    });
  });

  describe('LoginController', () => {
    it('logs in successfully', async () => {
      req.body = { email: 'test@example.com', password: 'pass' };
      (FirebaseAuthService.login as vi.Mock).mockResolvedValue('token123');
      await LoginController(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ data: 'token123' });
    });
    it('returns 400 if missing fields', async () => {
      req.body = { email: '' };
      await LoginController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Email and password are required.' });
    });
    it('handles login error', async () => {
      req.body = { email: 'fail@example.com', password: 'pass' };
      (FirebaseAuthService.login as vi.Mock).mockRejectedValue(new Error('Login failed.'));
      await LoginController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Login failed.' });
    });
  });

  describe('LogoutController', () => {
    it('logs out successfully', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue('token123');
      (FirebaseAuthService.logout as vi.Mock).mockResolvedValue(undefined);
      await LogoutController(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({ data: 'ok' });
    });
    it('returns 401 if no token', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue(undefined);
      await LogoutController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No token provided.' });
    });
    it('handles logout error', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue('token123');
      (FirebaseAuthService.logout as vi.Mock).mockRejectedValue(new Error('Logout failed.'));
      await LogoutController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Logout failed.' });
    });
  });

  describe('MeController', () => {
    it('returns user info successfully', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue('token123');
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue('token123');
      (FirebaseAuthService.verifyIdToken as vi.Mock).mockResolvedValue({ uid: '123' });
      (FirebaseAuthService.getUser as vi.Mock).mockResolvedValue({
        uid: '123',
        email: 'test@example.com',
      });
      await MeController(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        data: { id: 1, uid: '123', email: 'test@example.com' },
      });
    });
    it('returns 401 if no token', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue(undefined);
      await MeController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'No token provided.' });
    });
    it('handles auth error', async () => {
      (FirebaseAuthService.getIdTokenFromRequest as vi.Mock).mockReturnValue('token123');
      (FirebaseAuthService.verifyIdToken as vi.Mock).mockRejectedValue(new Error('Unauthorized.'));
      await MeController.handle(req as Request, res as Response);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Unauthorized.' });
    });
  });
});
