import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('firebase-admin', () => {
  const createSessionCookie = vi.fn().mockResolvedValue('session-cookie-123');
  const verifyIdToken = vi.fn().mockResolvedValue({ uid: 'uid-123', email: 'test@example.com' });
  return {
    default: {
      apps: [],
      initializeApp: vi.fn(),
      credential: {
        cert: vi.fn(),
      },
      auth: () => ({
        createSessionCookie,
        verifyIdToken,
        verifySessionCookie: vi.fn().mockResolvedValue({ uid: 'uid-123' }),
        getUser: vi.fn().mockResolvedValue({ uid: 'uid-123', email: 'test@example.com' }),
      }),
    },
  };
});

import * as FirebaseAuthService from '../FirebaseAuthService';

describe('FirebaseAuthService', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('createSessionCookie returns session cookie string', async () => {
    const cookie = await FirebaseAuthService.createSessionCookie('fake-id-token', 1000);
    expect(typeof cookie).toBe('string');
    expect(cookie).toBe('session-cookie-123');
  });

  it('verifyIdToken returns decoded token', async () => {
    const decoded = await FirebaseAuthService.verifyIdToken('fake-id-token');
    expect(decoded).toHaveProperty('uid', 'uid-123');
    expect(decoded).toHaveProperty('email', 'test@example.com');
  });
});
