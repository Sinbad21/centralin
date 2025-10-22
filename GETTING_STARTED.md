# 🚀 Getting Started - Chatbot Platform

Questa guida ti aiuterà a configurare e avviare la piattaforma chatbot in locale in meno di 10 minuti.

## ⚡ Quick Start con Docker (Raccomandato)

### Prerequisiti
- Docker Desktop installato
- Git

### Passi

1. **Clone del repository**
```bash
git clone <repository-url>
cd chatbot-platform
```

2. **Avvia i servizi con Docker Compose**
```bash
# Avvia solo database e cache
docker-compose up -d postgres redis

# Attendi che i servizi siano pronti (circa 10 secondi)
docker-compose ps
```

3. **Setup Database**
```bash
# Installa dipendenze
npm install

# Genera Prisma Client
cd packages/database
npm run generate

# Esegui migrazioni
npm run migrate

# Seed dati demo
npm run seed
```

4. **Configura API**
```bash
cd ../../apps/api

# Copia file .env
cp .env.example .env
```

Modifica `.env` con:
```env
DATABASE_URL="postgresql://chatbot:chatbot123@localhost:5432/chatbot_platform?schema=public"
REDIS_URL="redis://localhost:6379"
```

5. **Avvia API**
```bash
npm run dev
```

6. **Test API**
```bash
# Health check
curl http://localhost:3001/health

# Dovrebbe rispondere con:
# {"status":"ok","timestamp":"...","uptime":...}
```

✅ **Fatto! L'API è in esecuzione su http://localhost:3001**

## 🧪 Testa con Credentials Demo

Usa Postman, Insomnia o curl:

### 1. Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "demo@chatbot-platform.com",
    "password": "Password123!"
  }'
```

Risposta:
```json
{
  "user": {
    "id": "...",
    "email": "demo@chatbot-platform.com",
    "name": "Demo User"
  },
  "tokens": {
    "accessToken": "eyJ...",
    "refreshToken": "eyJ..."
  }
}
```

### 2. Ottieni Profilo
```bash
curl http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer <accessToken>"
```

### 3. Lista Bot
```bash
curl http://localhost:3001/api/bots \
  -H "Authorization: Bearer <accessToken>"
```

### 4. Crea un Bot
```bash
curl -X POST http://localhost:3001/api/bots \
  -H "Authorization: Bearer <accessToken>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Il Mio Bot",
    "description": "Bot di test",
    "category": "CUSTOM",
    "language": "it"
  }'
```

## 🛠️ Development Tools

### Prisma Studio (Database GUI)
```bash
cd packages/database
npm run studio
```
Apri: http://localhost:5555

### PgAdmin (Database Management)
```bash
# Avvia PgAdmin
docker-compose --profile tools up -d pgadmin
```
Apri: http://localhost:5050
- Email: admin@chatbot-platform.com
- Password: admin123

Connetti a database:
- Host: postgres
- Port: 5432
- Database: chatbot_platform
- Username: chatbot
- Password: chatbot123

### Redis Commander
```bash
# Avvia Redis Commander
docker-compose --profile tools up -d redis-commander
```
Apri: http://localhost:8081

## 📂 Struttura Progetto

```
chatbot-platform/
├── apps/
│   ├── api/                    # Express backend API
│   │   ├── src/
│   │   │   ├── routes/        # API routes
│   │   │   ├── middleware/    # Express middleware
│   │   │   └── server.ts      # Main server file
│   │   └── package.json
│   ├── web/                    # Next.js frontend (TODO)
│   └── widget/                 # Chat widget (TODO)
│
├── packages/
│   ├── database/              # Prisma schema & database layer
│   │   ├── prisma/
│   │   │   ├── schema.prisma  # Database schema
│   │   │   └── seed.ts        # Seed data
│   │   └── src/index.ts
│   │
│   ├── auth/                  # Authentication utilities
│   │   └── src/
│   │       ├── jwt.ts         # JWT handling
│   │       ├── password.ts    # Password hashing
│   │       ├── 2fa.ts         # 2FA support
│   │       └── validation.ts  # Zod schemas
│   │
│   └── types/                 # Shared TypeScript types (TODO)
│
├── docker-compose.yml         # Docker services
├── turbo.json                 # Turborepo config
└── package.json               # Root package.json
```

## 🔑 Environment Variables

### API (.env)
```env
# Server
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL="postgresql://chatbot:chatbot123@localhost:5432/chatbot_platform"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# CORS
ALLOWED_ORIGINS="http://localhost:3000,http://localhost:3001"

# Redis
REDIS_URL="redis://localhost:6379"

# OpenAI (per AI features future)
OPENAI_API_KEY=""

# Stripe (per billing future)
STRIPE_SECRET_KEY=""
```

## 🚨 Troubleshooting

### Porta già in uso
```bash
# Trova processo su porta 3001
lsof -ti:3001

# Killa processo
kill -9 <PID>
```

### Database connection error
```bash
# Verifica che PostgreSQL sia running
docker-compose ps postgres

# Controlla logs
docker-compose logs postgres

# Riavvia
docker-compose restart postgres
```

### Prisma Client error
```bash
# Regenera Prisma Client
cd packages/database
npx prisma generate
```

### Migrazioni non applicate
```bash
cd packages/database
npx prisma migrate dev
```

### Reset completo database
```bash
cd packages/database
npx prisma migrate reset  # ATTENZIONE: Cancella tutti i dati!
npm run seed
```

## 📊 Database Schema Highlights

### Users
- Email/password authentication
- JWT sessions
- 2FA support
- Scraping credits

### Bots
- Multi-tenant (user isolation)
- Configuration (personality, behavior)
- Widget appearance settings
- Marketplace support

### Knowledge Base
- Documents (PDF, DOCX, TXT, web)
- Embeddings for semantic search
- Processing pipeline

### Conversations
- Message history
- Sentiment analysis
- User data collection
- Analytics

### Scraping
- Campaign management
- Lead scoring
- AI insights

Vedi schema completo: `packages/database/prisma/schema.prisma`

## 🎯 Prossimi Passi

Ora che l'API è funzionante:

1. **Esplora le API** con Postman/Insomnia
2. **Leggi la documentazione** completa nel README.md
3. **Contribuisci** al frontend (Next.js - coming soon)
4. **Implementa** nuove features seguendo la specifica

## 📚 Risorse

- [README Completo](./README.md)
- [Architettura](./CHATBOT_PLATFORM_ARCHITECTURE.md)
- [Specifica Funzionale Completa](./CHATBOT_PLATFORM_SPEC.md)
- [Prisma Docs](https://www.prisma.io/docs/)
- [Express.js Docs](https://expressjs.com/)

## 💬 Supporto

Per domande o problemi:
- Apri un issue su GitHub
- Contatta: dev@chatbot-platform.com

---

Buon coding! 🚀
