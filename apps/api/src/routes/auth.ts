import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '@chatbot-platform/database';
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  verifyRefreshToken,
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '@chatbot-platform/auth';
import { AppError } from '../middleware/error-handler';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

/**
 * POST /api/auth/register
 * Register a new user
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const data = registerSchema.parse(req.body);

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Email già registrata', 409);
    }

    // Hash password
    const passwordHash = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
        company: data.company,
        accountType: data.accountType,
      },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        accountType: true,
        createdAt: true,
      },
    });

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    res.status(201).json({
      user,
      tokens,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login
 * Login user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate input
    const data = loginSchema.parse(req.body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Email o password non validi', 401);
    }

    // Compare password
    const isValid = await comparePassword(data.password, user.passwordHash);

    if (!isValid) {
      throw new AppError('Email o password non validi', 401);
    }

    // Check 2FA if enabled
    if (user.twoFactorEnabled) {
      if (!data.twoFactorCode) {
        return res.status(200).json({
          requires2FA: true,
          message: 'Codice 2FA richiesto',
        });
      }

      // TODO: Verify 2FA code
      // For now, skip 2FA verification
    }

    // Generate tokens
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
    });

    // Create session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.rememberMe ? 30 : 7));

    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        expiresAt,
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      },
    });

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    // Return user without password
    const { passwordHash, twoFactorSecret, ...userWithoutSensitive } = user;

    res.json({
      user: userWithoutSensitive,
      tokens,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/refresh
 * Refresh access token
 */
router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      throw new AppError('Refresh token richiesto', 400);
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if session exists and is active
    const session = await prisma.session.findUnique({
      where: { refreshToken },
    });

    if (!session || !session.active || session.expiresAt < new Date()) {
      throw new AppError('Sessione scaduta', 401);
    }

    // Generate new tokens
    const tokens = generateTokenPair({
      userId: payload.userId,
      email: payload.email,
    });

    // Update session
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    });

    res.json({ tokens });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/logout
 * Logout user
 */
router.post('/logout', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader!.substring(7);

    // Deactivate session
    await prisma.session.updateMany({
      where: {
        userId: req.user!.userId,
        token,
      },
      data: {
        active: false,
      },
    });

    res.json({ message: 'Logout effettuato con successo' });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me
 * Get current user
 */
router.get('/me', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      select: {
        id: true,
        email: true,
        name: true,
        company: true,
        avatar: true,
        accountType: true,
        planId: true,
        language: true,
        timezone: true,
        emailVerified: true,
        twoFactorEnabled: true,
        scrapingCredits: true,
        createdAt: true,
        lastLoginAt: true,
      },
    });

    if (!user) {
      throw new AppError('Utente non trovato', 404);
    }

    res.json({ user });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/forgot-password
 * Send password reset email
 */
router.post('/forgot-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    // Always return success (security best practice)
    res.json({
      message: 'Se l\'email esiste, riceverai le istruzioni per il reset della password',
    });

    if (!user) {
      return;
    }

    // TODO: Generate reset token and send email
    // For now, just log
    console.log('Password reset requested for:', user.email);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with token
 */
router.post('/reset-password', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = resetPasswordSchema.parse(req.body);

    // TODO: Verify reset token and update password
    // For now, just return success
    res.json({ message: 'Password reimpostata con successo' });
  } catch (error) {
    next(error);
  }
});

export default router;
