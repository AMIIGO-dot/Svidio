import jwt from 'jsonwebtoken';
import { ENV } from '../config.js';
import { TOKEN_DEFAULTS } from '@svidio/types';

interface TokenPayload {
  meetingId: string;
  displayName: string;
}

export function createJoinToken(meetingId: string, displayName: string): { token: string; expiresAt: string } {
  const expiresAt = new Date(
    Date.now() + TOKEN_DEFAULTS.EXPIRY_MINUTES * 60_000
  );

  const token = jwt.sign(
    { meetingId, displayName } satisfies TokenPayload,
    ENV.JWT_SECRET,
    { expiresIn: `${TOKEN_DEFAULTS.EXPIRY_MINUTES}m` }
  );

  return { token, expiresAt: expiresAt.toISOString() };
}

export function verifyJoinToken(token: string): TokenPayload | null {
  try {
    return jwt.verify(token, ENV.JWT_SECRET) as TokenPayload;
  } catch {
    return null;
  }
}
