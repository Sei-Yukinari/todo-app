import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { z } from 'zod';

// User Zod schema (adjust as needed)
export const UserSchema = z.object({
  id: z.number().int(),
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type User = z.infer<typeof UserSchema>;

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';
const BCRYPT_SALT_ROUNDS = 10;

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    try {
      return await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
    } catch (err) {
      throw new Error('Password hashing failed');
    }
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, hash);
    } catch (err) {
      throw new Error('Password verification failed');
    }
  }

  static issueJWT(user: User): string {
    try {
      // Only include non-sensitive fields in the payload
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };
      return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    } catch (err) {
      throw new Error('JWT issuance failed');
    }
  }

  static verifyJWT(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (err) {
      throw new Error('JWT verification failed');
    }
  }
}
