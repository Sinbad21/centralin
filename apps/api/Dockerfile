# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY turbo.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/auth/package*.json ./packages/auth/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api
COPY packages/database ./packages/database
COPY packages/auth ./packages/auth

# Generate Prisma Client
RUN cd packages/database && npx prisma generate

# Build packages
RUN cd packages/database && npm run build
RUN cd packages/auth && npm run build
RUN cd apps/api && npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
COPY packages/database/package*.json ./packages/database/
COPY packages/auth/package*.json ./packages/auth/

# Install production dependencies only
RUN npm install --production

# Copy built files from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist
COPY --from=builder /app/packages/database/dist ./packages/database/dist
COPY --from=builder /app/packages/database/prisma ./packages/database/prisma
COPY --from=builder /app/packages/auth/dist ./packages/auth/dist

# Generate Prisma Client in production
RUN cd packages/database && npx prisma generate

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start server
CMD ["node", "apps/api/dist/server.js"]
