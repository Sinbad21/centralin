import express, { Request, Response, NextFunction } from 'express';
import { prisma } from '@chatbot-platform/database';
import { requireAuth } from '../middleware/auth';
import { AppError } from '../middleware/error-handler';
import { z } from 'zod';

const router = express.Router();

// Validation schemas
const createBotSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
  category: z.enum([
    'CUSTOMER_SUPPORT',
    'SALES',
    'HR',
    'EDUCATION',
    'HEALTHCARE',
    'ECOMMERCE',
    'BOOKING',
    'LEAD_GEN',
    'CUSTOM',
  ]),
  language: z.string().default('it'),
  status: z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED']).optional(),
  config: z.object({
    personality: z.string().optional(),
    tone: z.string().optional(),
    systemInstructions: z.string().optional(),
    fallbackMessage: z.string().optional(),
  }).optional(),
  appearance: z.object({
    primaryColor: z.string().optional(),
    position: z.string().optional(),
    welcomeMessage: z.string().optional(),
    avatar: z.string().optional(),
    headerText: z.string().optional(),
    placeholderText: z.string().optional(),
  }).optional(),
  integration: z.object({
    allowedDomains: z.array(z.string()).optional(),
  }).optional(),
});

const updateBotSchema = createBotSchema.partial();

const createIntentSchema = z.object({
  name: z.string().min(1).max(100),
  examples: z.array(z.string()),
  response: z.string(),
  priority: z.number().min(1).max(10).default(5),
});

/**
 * GET /api/bots
 * Get all bots for current user
 */
router.get('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bots = await prisma.bot.findMany({
      where: { userId: req.user!.userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        language: true,
        avatar: true,
        status: true,
        conversationCount: true,
        messageCount: true,
        avgSentiment: true,
        isPublic: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    res.json({ bots });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bots
 * Create a new bot
 */
router.post('/', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = createBotSchema.parse(req.body);

    const bot = await prisma.bot.create({
      data: {
        userId: req.user!.userId,
        name: data.name,
        description: data.description,
        category: data.category,
        language: data.language,
        status: data.status || 'DRAFT',
        config: data.config || {
          personality: 'friendly',
          tone: 'professional',
          systemInstructions: '',
          fallbackMessage: 'Mi dispiace, non ho capito. Puoi riformulare la domanda?',
        },
        appearance: data.appearance || {
          primaryColor: '#6366f1',
          position: 'bottom-right',
          welcomeMessage: 'Ciao! Come posso aiutarti?',
          headerText: 'Chat di supporto',
          placeholderText: 'Scrivi un messaggio...',
        },
        integration: data.integration || {
          allowedDomains: [],
          cors: true,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        language: true,
        status: true,
        config: true,
        appearance: true,
        integration: true,
        createdAt: true,
      },
    });

    res.status(201).json({ bot });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bots/:id
 * Get specific bot
 */
router.get('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
      include: {
        _count: {
          select: {
            conversations: true,
            documents: true,
            intents: true,
          },
        },
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    res.json({ bot });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/bots/:id
 * Update bot
 */
router.patch('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = updateBotSchema.parse(req.body);

    // Check ownership
    const existingBot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!existingBot) {
      throw new AppError('Bot non trovato', 404);
    }

    // Update bot
    const bot = await prisma.bot.update({
      where: { id },
      data,
    });

    res.json({ bot });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/bots/:id
 * Delete bot
 */
router.delete('/:id', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Check ownership
    const existingBot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!existingBot) {
      throw new AppError('Bot non trovato', 404);
    }

    // Delete bot (cascade will delete related data)
    await prisma.bot.delete({
      where: { id },
    });

    res.json({ message: 'Bot eliminato con successo' });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bots/:id/publish
 * Publish bot (make active)
 */
router.post('/:id/publish', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: {
        status: 'ACTIVE',
        publishedAt: new Date(),
      },
    });

    res.json({ bot: updatedBot });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bots/:id/pause
 * Pause bot
 */
router.post('/:id/pause', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    const updatedBot = await prisma.bot.update({
      where: { id },
      data: { status: 'PAUSED' },
    });

    res.json({ bot: updatedBot });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bots/:id/documents
 * Get bot documents
 */
router.get('/:id/documents', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    const documents = await prisma.document.findMany({
      where: { botId: id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ documents });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bots/:id/documents
 * Upload document
 */
router.post('/:id/documents', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    // TODO: Handle file upload and processing
    // For now, create a simple text document
    const document = await prisma.document.create({
      data: {
        botId: id,
        title: req.body.title || 'Untitled Document',
        content: req.body.content || '',
        type: req.body.type || 'TXT',
        status: 'PENDING',
      },
    });

    res.status(201).json({ document });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bots/:id/intents
 * Get bot intents
 */
router.get('/:id/intents', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    const intents = await prisma.intent.findMany({
      where: { botId: id },
      orderBy: { hitCount: 'desc' },
    });

    res.json({ intents });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bots/:id/intents
 * Create bot intent (FAQ)
 */
router.post('/:id/intents', requireAuth, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = createIntentSchema.parse(req.body);

    const bot = await prisma.bot.findFirst({
      where: {
        id,
        userId: req.user!.userId,
      },
    });

    if (!bot) {
      throw new AppError('Bot non trovato', 404);
    }

    const intent = await prisma.intent.create({
      data: {
        botId: id,
        name: data.name,
        examples: data.examples,
        response: data.response,
        priority: data.priority,
      },
    });

    res.status(201).json({ intent });
  } catch (error) {
    next(error);
  }
});

export default router;
