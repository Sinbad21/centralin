import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@chatbot-platform/auth';
import { AppError } from './error-handler';

// Extend Express Request to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role?: string;
      };
    }
  }
}

/**
 * Middleware to require authentication
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new AppError('No token provided', 401);
    }

    const token = authHeader.substring(7);

    // Verify token
    const payload = verifyAccessToken(token);

    // Attach user to request
    req.user = {
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
}

/**
 * Optional authentication (doesn't fail if no token)
 */
export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);

      req.user = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    }

    next();
  } catch (error) {
    // Ignore errors for optional auth
    next();
  }
}
