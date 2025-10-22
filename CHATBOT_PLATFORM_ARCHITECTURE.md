# Architettura Piattaforma SaaS Chatbot

## Overview
Piattaforma multi-tenant per creazione, training e deployment di chatbot AI con marketplace integrato, scraping B2B e analytics avanzate.

## Stack Tecnologico

### Frontend
- **Framework**: Next.js 14 (React 18, App Router)
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod validation
- **Charts**: Recharts
- **Maps**: Google Maps API
- **Rich Text**: TipTap
- **Deployment**: Vercel / AWS Amplify

### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js (o Fastify per performance)
- **Language**: TypeScript
- **API Style**: RESTful + GraphQL (opzionale)
- **Deployment**: AWS ECS / Google Cloud Run

### Database
- **Primary DB**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache**: Redis (sessioni, rate limiting, queue)
- **Vector DB**: Pinecone / Weaviate (per embeddings)
- **Search**: Elasticsearch / Algolia

### AI/ML
- **LLM**: OpenAI GPT-4 / Anthropic Claude
- **Embeddings**: OpenAI text-embedding-3
- **Sentiment**: HuggingFace transformers
- **Translation**: DeepL API

### Infrastructure
- **Hosting**: AWS / Google Cloud / Azure
- **Containers**: Docker + Kubernetes
- **CDN**: Cloudflare
- **Object Storage**: AWS S3
- **Monitoring**: Datadog / New Relic
- **Error Tracking**: Sentry
- **Logging**: Winston + CloudWatch

### Payments
- **Processor**: Stripe (primary)
- **Billing**: Stripe Billing & Invoicing

### Communication
- **Email**: SendGrid / Postmark
- **SMS**: Twilio
- **Push**: Firebase Cloud Messaging

## Architettura Sistema

### Monorepo Structure
```
chatbot-platform/
├── apps/
│   ├── web/                    # Next.js frontend
│   ├── api/                    # Express backend
│   ├── widget/                 # Chat widget (standalone)
│   └── admin/                  # Admin dashboard (opzionale)
├── packages/
│   ├── ui/                     # Shared UI components
│   ├── database/               # Prisma schema + migrations
│   ├── auth/                   # Authentication logic
│   ├── ai/                     # AI/ML utilities
│   ├── scraper/                # Web scraping engine
│   └── types/                  # Shared TypeScript types
├── infrastructure/
│   ├── docker/                 # Docker configs
│   ├── k8s/                    # Kubernetes manifests
│   └── terraform/              # Infrastructure as Code
├── scripts/                    # Build & deployment scripts
└── docs/                       # Documentation
```

## Database Schema (Core Tables)

### Users & Authentication
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  passwordHash  String
  name          String?
  company       String?
  accountType   AccountType @default(INDIVIDUAL)
  planId        String?
  stripeCustomerId String? @unique

  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  bots          Bot[]
  teamMembers   TeamMember[]
  subscriptions Subscription[]
  sessions      Session[]

  @@index([email])
}

enum AccountType {
  INDIVIDUAL
  BUSINESS
  ENTERPRISE
}

model Session {
  id           String   @id @default(cuid())
  userId       String
  token        String   @unique
  expiresAt    DateTime
  ipAddress    String?
  userAgent    String?

  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([token])
}
```

### Bots
```prisma
model Bot {
  id              String   @id @default(cuid())
  userId          String
  name            String
  description     String?
  category        BotCategory
  language        String   @default("it")
  avatar          String?
  status          BotStatus @default(DRAFT)

  // Configuration
  config          Json     // Personality, behavior settings
  appearance      Json     // Widget customization
  integration     Json     // Embed settings

  // Stats
  conversationCount Int    @default(0)
  messageCount      Int    @default(0)

  // Marketplace
  isPublic        Boolean  @default(false)
  pricing         Json?    // Plans and pricing

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  conversations   Conversation[]
  documents       Document[]
  intents         Intent[]

  @@index([userId])
  @@index([status])
  @@index([isPublic])
}

enum BotCategory {
  CUSTOMER_SUPPORT
  SALES
  HR
  EDUCATION
  HEALTHCARE
  CUSTOM
}

enum BotStatus {
  DRAFT
  ACTIVE
  PAUSED
  ARCHIVED
}
```

### Knowledge Base
```prisma
model Document {
  id          String   @id @default(cuid())
  botId       String
  title       String
  content     String   @db.Text
  type        DocumentType
  source      String?  // URL or file path
  metadata    Json?

  // Processing
  status      ProcessStatus @default(PENDING)
  chunks      Int      @default(0)

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bot         Bot      @relation(fields: [botId], references: [id], onDelete: Cascade)
  embeddings  Embedding[]

  @@index([botId])
  @@index([status])
}

enum DocumentType {
  PDF
  DOCX
  TXT
  CSV
  JSON
  WEB_PAGE
  API
}

enum ProcessStatus {
  PENDING
  PROCESSING
  COMPLETED
  FAILED
}

model Embedding {
  id          String   @id @default(cuid())
  documentId  String
  text        String   @db.Text
  vector      Json     // Embedding vector
  metadata    Json?

  document    Document @relation(fields: [documentId], references: [id], onDelete: Cascade)

  @@index([documentId])
}
```

### Conversations
```prisma
model Conversation {
  id          String   @id @default(cuid())
  botId       String
  userId      String?  // Anonymous users = null
  sessionId   String

  // Metadata
  source      String?  // website, whatsapp, etc
  userAgent   String?
  ipAddress   String?
  location    Json?

  // Analytics
  messageCount Int     @default(0)
  duration    Int?    // seconds
  sentiment   Float?  // -1 to 1
  resolution  ConversationResolution?

  // Data collected
  userData    Json?   // Form data collected

  startedAt   DateTime @default(now())
  endedAt     DateTime?

  bot         Bot      @relation(fields: [botId], references: [id], onDelete: Cascade)
  messages    Message[]

  @@index([botId])
  @@index([sessionId])
  @@index([startedAt])
}

enum ConversationResolution {
  RESOLVED
  UNRESOLVED
  ESCALATED
  ABANDONED
}

model Message {
  id              String   @id @default(cuid())
  conversationId  String
  sender          MessageSender
  content         String   @db.Text
  type            MessageType @default(TEXT)

  // AI metadata
  intent          String?
  confidence      Float?
  sentiment       Float?

  createdAt       DateTime @default(now())

  conversation    Conversation @relation(fields: [conversationId], references: [id], onDelete: Cascade)

  @@index([conversationId])
  @@index([createdAt])
}

enum MessageSender {
  USER
  BOT
  HUMAN
}

enum MessageType {
  TEXT
  IMAGE
  FILE
  VOICE
  CARD
  CAROUSEL
  FORM
}
```

### Intents
```prisma
model Intent {
  id          String   @id @default(cuid())
  botId       String
  name        String
  description String?

  // Training
  examples    String[] // Training phrases
  response    Json     // Response template
  actions     Json?    // Webhook, API calls

  // Stats
  hitCount    Int      @default(0)
  avgConfidence Float?

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  bot         Bot      @relation(fields: [botId], references: [id], onDelete: Cascade)

  @@index([botId])
  @@unique([botId, name])
}
```

### Scraping & Lead Generation
```prisma
model ScrapingCampaign {
  id          String   @id @default(cuid())
  userId      String
  name        String
  objective   String   @db.Text

  // Filters
  location    Json     // City, radius
  businessType String[]
  filters     Json

  // Status
  status      CampaignStatus @default(PENDING)
  progress    Int      @default(0)

  // Results
  leadsFound  Int      @default(0)
  creditsUsed Int      @default(0)

  createdAt   DateTime @default(now())
  completedAt DateTime?

  leads       Lead[]

  @@index([userId])
  @@index([status])
}

enum CampaignStatus {
  PENDING
  RUNNING
  COMPLETED
  FAILED
}

model Lead {
  id          String   @id @default(cuid())
  campaignId  String

  // Business info
  name        String
  address     String?
  phone       String?
  email       String?
  website     String?

  // Social
  socialLinks Json?

  // Analysis
  score       Int      // 0-100
  insights    Json     // AI-generated insights
  painPoints  String[]

  // Status
  status      LeadStatus @default(NEW)
  notes       String?  @db.Text

  createdAt   DateTime @default(now())

  campaign    ScrapingCampaign @relation(fields: [campaignId], references: [id], onDelete: Cascade)

  @@index([campaignId])
  @@index([score])
  @@index([status])
}

enum LeadStatus {
  NEW
  CONTACTED
  INTERESTED
  NOT_INTERESTED
  CONVERTED
}
```

### Marketplace
```prisma
model Subscription {
  id          String   @id @default(cuid())
  userId      String
  botId       String
  planId      String

  stripeSubscriptionId String @unique
  status      SubscriptionStatus

  currentPeriodStart DateTime
  currentPeriodEnd   DateTime

  createdAt   DateTime @default(now())
  canceledAt  DateTime?

  user        User     @relation(fields: [userId], references: [id])

  @@index([userId])
  @@index([botId])
  @@index([status])
}

enum SubscriptionStatus {
  ACTIVE
  CANCELED
  PAST_DUE
  UNPAID
}
```

## API Endpoints Structure

### Authentication
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
POST   /api/auth/forgot-password
POST   /api/auth/reset-password
POST   /api/auth/verify-email
```

### Bots
```
GET    /api/bots
POST   /api/bots
GET    /api/bots/:id
PATCH  /api/bots/:id
DELETE /api/bots/:id
POST   /api/bots/:id/publish
POST   /api/bots/:id/pause
```

### Knowledge Base
```
GET    /api/bots/:id/documents
POST   /api/bots/:id/documents/upload
POST   /api/bots/:id/documents/scrape
DELETE /api/bots/:id/documents/:docId
POST   /api/bots/:id/documents/:docId/reprocess
```

### Conversations
```
GET    /api/bots/:id/conversations
GET    /api/conversations/:id
POST   /api/conversations
POST   /api/conversations/:id/messages
DELETE /api/conversations/:id
```

### Analytics
```
GET    /api/analytics/overview
GET    /api/analytics/bots/:id
GET    /api/analytics/conversations
GET    /api/analytics/intents
GET    /api/analytics/export
```

### Scraping
```
GET    /api/scraping/campaigns
POST   /api/scraping/campaigns
GET    /api/scraping/campaigns/:id
GET    /api/scraping/campaigns/:id/leads
PATCH  /api/scraping/leads/:id
```

### Marketplace
```
GET    /api/marketplace/bots
GET    /api/marketplace/bots/:id
POST   /api/marketplace/subscribe
GET    /api/subscriptions
POST   /api/subscriptions/:id/cancel
```

## Security & Compliance

### Authentication & Authorization
- JWT tokens (15min access, 7d refresh)
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min per IP)
- CSRF protection
- 2FA support (TOTP)

### Data Protection
- Encryption at rest (AES-256)
- Encryption in transit (TLS 1.3)
- PII anonymization
- GDPR compliance tools
- Data retention policies

### API Security
- API key authentication
- OAuth 2.0 scopes
- Webhook signature verification
- Input validation & sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection

## Deployment Strategy

### Development
- Local: Docker Compose
- DB: PostgreSQL + Redis containers
- Hot reload: Next.js + nodemon

### Staging
- AWS ECS / GCP Cloud Run
- RDS PostgreSQL
- ElastiCache Redis
- S3 for assets
- CloudFront CDN

### Production
- Multi-region deployment
- Auto-scaling (2-20 instances)
- Load balancer (ALB/NLB)
- Database replication
- Automated backups (every 6h)
- Blue-green deployment
- Monitoring & alerting

## Performance Targets

- API response time: p95 < 300ms
- Widget load time: < 1s
- Bot response time: < 2s
- Uptime: 99.9%
- Database queries: < 50ms
- Cache hit rate: > 80%

## Scaling Strategy

### Phase 1 (0-1K users)
- Single-region monolith
- 1 DB instance
- 2-4 app servers
- Basic caching

### Phase 2 (1K-10K users)
- Multi-region deployment
- DB read replicas
- Redis cluster
- CDN for static assets
- Elasticsearch for search

### Phase 3 (10K-100K users)
- Microservices architecture
- Database sharding
- Message queue (RabbitMQ/SQS)
- Dedicated AI service
- Advanced caching strategy

### Phase 4 (100K+ users)
- Global infrastructure
- Edge computing
- Custom ML models
- Multi-cloud redundancy
- Advanced analytics pipeline

## Development Phases

### Phase 1: Foundation (Month 1-3)
- Project setup & infrastructure
- Authentication system
- Database schema
- Basic bot creation
- Simple chat widget
- MVP dashboard

### Phase 2: Core Features (Month 4-6)
- Advanced bot training
- Knowledge base management
- Analytics dashboard
- Integrations (top 3)
- Billing system
- Beta launch

### Phase 3: Growth (Month 7-12)
- Marketplace
- Scraping tool
- Voice features
- Mobile optimization
- 10+ integrations
- Public launch

### Phase 4: Scale (Year 2+)
- Enterprise features
- White-label
- Mobile apps
- Advanced AI
- Global expansion

## Next Steps

1. ✅ Setup monorepo structure
2. Initialize Next.js + Express projects
3. Configure Prisma + PostgreSQL
4. Implement authentication system
5. Create basic bot CRUD
6. Build simple chat widget
7. Deploy MVP to staging

---

**Document Version**: 1.0
**Last Updated**: 2025-01-15
**Author**: Development Team
