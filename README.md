# 🤖 Chatbot Platform - SaaS Multi-Tenant

Una piattaforma SaaS completa per creare, addestrare e deployare chatbot AI personalizzati con marketplace integrato, scraping B2B e analytics avanzate.

## 📋 Panoramica

Questa piattaforma permette agli utenti di:

- ✨ **Creare chatbot AI** personalizzati con wizard guidato
- 📚 **Addestrare bot** con documenti, siti web, API e conversazioni
- 🎨 **Personalizzare** completamente l'aspetto e il comportamento
- 📊 **Monitorare** performance con analytics dettagliate
- 🛒 **Monetizzare** bot tramite marketplace interno
- 🔍 **Generare lead B2B** con scraping intelligente
- 🔌 **Integrare** con 20+ piattaforme (CRM, e-commerce, calendar, ecc.)

## 🏗️ Architettura

### Stack Tecnologico

#### Frontend
- **Framework**: Next.js 14 (React 18, App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **State**: Zustand
- **Forms**: React Hook Form + Zod

#### Backend
- **Runtime**: Node.js 20+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Cache**: Redis

#### AI/ML
- **LLM**: OpenAI GPT-4 / Anthropic Claude
- **Embeddings**: OpenAI text-embedding-3
- **Vector DB**: Pinecone / Weaviate

### Struttura Monorepo

```
chatbot-platform/
├── apps/
│   ├── web/          # Next.js frontend (TODO)
│   ├── api/          # Express backend ✅
│   └── widget/       # Chat widget (TODO)
├── packages/
│   ├── database/     # Prisma schema ✅
│   ├── auth/         # Authentication ✅
│   ├── ui/           # UI components (TODO)
│   └── types/        # Shared types (TODO)
└── docs/             # Documentation
```

## 🚀 Quick Start

### Prerequisiti

- Node.js 20+
- npm 10+
- PostgreSQL 15+
- Redis 7+

### 1. Clone e Installazione

```bash
git clone <repository-url>
cd chatbot-platform

# Installa le dipendenze
npm install

# Naviga al package database
cd packages/database

# Copia e configura .env
cp .env.example .env
```

### 2. Configurazione Database

Modifica `packages/database/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_platform?schema=public"
```

### 3. Migrazioni Database

```bash
# Genera Prisma Client
npm run db:generate

# Esegui migrazioni
npm run db:migrate

# (Opzionale) Seed dati demo
npm run db:seed
```

### 4. Configurazione API

```bash
cd ../../apps/api

# Copia e configura .env
cp .env.example .env
```

Modifica `apps/api/.env`:

```env
PORT=3001
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_platform?schema=public"
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-super-secret-refresh-key"
ALLOWED_ORIGINS="http://localhost:3000"
```

### 5. Avvia Backend API

```bash
# Development mode con hot reload
npm run dev

# Build per production
npm run build

# Start production
npm start
```

L'API sarà disponibile su: `http://localhost:3001`

Health check: `http://localhost:3001/health`

## 🐳 Docker Setup (Raccomandato)

### Docker Compose

Crea `docker-compose.yml` nella root:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: chatbot
      POSTGRES_PASSWORD: chatbot123
      POSTGRES_DB: chatbot_platform
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "3001:3001"
    environment:
      DATABASE_URL: postgresql://chatbot:chatbot123@postgres:5432/chatbot_platform
      REDIS_URL: redis://redis:6379
      NODE_ENV: production
    depends_on:
      - postgres
      - redis

volumes:
  postgres_data:
  redis_data:
```

### Avvia con Docker

```bash
docker-compose up -d
```

## 📚 API Documentation

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "confirmPassword": "Password123!",
  "name": "Mario Rossi",
  "company": "My Company",
  "accountType": "BUSINESS",
  "acceptTerms": true
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "Password123!",
  "rememberMe": true
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <access_token>
```

### Bots

#### List Bots
```http
GET /api/bots
Authorization: Bearer <access_token>
```

#### Create Bot
```http
POST /api/bots
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Assistente E-commerce",
  "description": "Bot per supporto clienti",
  "category": "ECOMMERCE",
  "language": "it"
}
```

#### Get Bot Details
```http
GET /api/bots/:id
Authorization: Bearer <access_token>
```

#### Update Bot
```http
PATCH /api/bots/:id
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Nuovo Nome",
  "description": "Nuova descrizione"
}
```

#### Delete Bot
```http
DELETE /api/bots/:id
Authorization: Bearer <access_token>
```

#### Publish Bot
```http
POST /api/bots/:id/publish
Authorization: Bearer <access_token>
```

## 🗄️ Database Schema

### Tabelle Principali

#### Users
- Autenticazione e gestione utenti
- Ruoli e permessi
- Preferenze e impostazioni

#### Bots
- Configurazione bot (personalità, comportamento)
- Aspetto widget
- Impostazioni integrazione

#### Documents
- Knowledge base documenti
- PDF, DOCX, TXT, web pages
- Processing status

#### Embeddings
- Vettori per similarity search
- Integrazione con vector database

#### Conversations & Messages
- Storico conversazioni
- Analytics e sentiment
- User data collection

#### Intents
- Pattern recognition
- Training examples
- Response templates

#### ScrapingCampaigns & Leads
- Campagne lead generation
- Business data
- AI scoring e insights

Vedi schema completo in: `packages/database/prisma/schema.prisma`

## 🔐 Security

### Autenticazione
- JWT tokens (15min access, 7d refresh)
- bcrypt password hashing (12 rounds)
- 2FA support (TOTP)

### API Security
- Rate limiting (100 req/15min)
- CORS configuration
- Helmet security headers
- Input validation con Zod

### Data Protection
- Encryption at rest
- Encryption in transit (TLS 1.3)
- GDPR compliance tools

## 📊 Database Migrations

### Creare una nuova migration

```bash
cd packages/database
npx prisma migrate dev --name nome_migration
```

### Applicare migrations in production

```bash
npx prisma migrate deploy
```

### Visualizzare database

```bash
npm run db:studio
```

Prisma Studio si aprirà su: `http://localhost:5555`

## 🧪 Testing

### Unit Tests
```bash
npm run test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 📦 Deployment

### Vercel (Frontend - quando sarà pronto)
```bash
vercel --prod
```

### Railway/Render (Backend)
```bash
# Configure environment variables
# Deploy from GitHub
```

### AWS (Production)
- ECS per containers
- RDS per PostgreSQL
- ElastiCache per Redis
- S3 per file storage
- CloudFront CDN

## 🛠️ Development

### Workspace Commands

```bash
# Installa dipendenze
npm install

# Build tutti i packages
npm run build

# Development mode (tutti i packages)
npm run dev

# Lint
npm run lint

# Clean
npm run clean
```

### Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Open Prisma Studio
npm run db:studio

# Seed database
cd packages/database && npm run seed
```

## 📝 Credentials Demo

Dopo il seeding del database:

```
Email: demo@chatbot-platform.com
Password: Password123!
```

## 🔄 Stato Implementazione

### ✅ Completato (Phase 1 - Foundation)

- [x] Architettura e struttura monorepo
- [x] Database schema completo (Prisma)
- [x] Authentication system (JWT, bcrypt, 2FA)
- [x] Express API server
- [x] Bot CRUD operations
- [x] Middleware (auth, error handling, rate limiting)
- [x] Security setup (CORS, Helmet, validation)

### 🚧 In Sviluppo (Phase 2)

- [ ] Next.js frontend
- [ ] Dashboard UI
- [ ] Bot creation wizard (5 steps)
- [ ] Knowledge base management
- [ ] Chat widget (embeddable)
- [ ] Document processing & embeddings

### 📋 TODO (Phase 3+)

- [ ] Analytics dashboard
- [ ] Marketplace
- [ ] Scraping engine
- [ ] Integrazioni (Shopify, Stripe, Calendar, CRM)
- [ ] Email system
- [ ] Voice input/output
- [ ] Mobile app
- [ ] Advanced AI features

## 📖 Documentazione Aggiuntiva

- [Architettura Completa](./CHATBOT_PLATFORM_ARCHITECTURE.md)
- [Specifica Funzionale](./CHATBOT_PLATFORM_SPEC.md) - Documento originale con tutte le features

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

Proprietario - Tutti i diritti riservati

## 🆘 Support

Per domande o supporto:
- Email: support@chatbot-platform.com
- Documentation: https://docs.chatbot-platform.com

---

**Version**: 1.0.0 (MVP)
**Last Updated**: 2025-01-15
**Status**: 🚧 In Active Development
