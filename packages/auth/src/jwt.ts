import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-change-this';

export interface JWTPayload {
  userId: string;
  email: string;
  role?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Generate access token (15 minutes expiry)
 */
export function generateAccessToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: '15m',
  });
}

/**
 * Generate refresh token (7 days expiry)
 */
export function generateRefreshToken(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '7d',
  });
}

/**
 * Generate both access and refresh tokens
 */
export function generateTokenPair(payload: JWTPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

/**
 * Verify access token
 */
export function verifyAccessToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired access token');
  }
}

/**
 * Verify refresh token
 */
export function verifyRefreshToken(token: string): JWTPayload {
  try {
    return jwt.verify(token, JWT_REFRESH_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired refresh token');
  }
}

/**
 * Decode token without verification (useful for expired tokens)
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    return jwt.decode(token) as JWTPayload;
  } catch {
    return null;
  }
}
