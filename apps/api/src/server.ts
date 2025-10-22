import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/error-handler';
import { notFound } from './middleware/not-found';
import authRoutes from './routes/auth';
import botRoutes from './routes/bots';
import conversationRoutes from './routes/conversations';
import analyticsRoutes from './routes/analytics';
import scrapingRoutes from './routes/scraping';
import marketplaceRoutes from './routes/marketplace';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// ============================================================================
// MIDDLEWARE
// ============================================================================

// Security
app.use(helmet());

// CORS
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// ============================================================================
// ROUTES
// ============================================================================

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/bots', botRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/scraping', scrapingRoutes);
app.use('/api/marketplace', marketplaceRoutes);

// ============================================================================
// ERROR HANDLING
// ============================================================================

app.use(notFound);
app.use(errorHandler);

// ============================================================================
// START SERVER
// ============================================================================

app.listen(PORT, () => {
  console.log(`🚀 API Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});

export default app;
