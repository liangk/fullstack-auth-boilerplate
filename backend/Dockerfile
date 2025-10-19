# Production Dockerfile for Railway deployment
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL to fix Prisma SSL warnings
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Create a simple startup script that handles DATABASE_URL validation
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'if [ -z "$DATABASE_URL" ]; then' >> /app/start.sh && \
    echo '  echo "Error: DATABASE_URL environment variable is not set"' >> /app/start.sh && \
    echo '  exit 1' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Generating Prisma Client..."' >> /app/start.sh && \
    echo 'npx prisma generate' >> /app/start.sh && \
    echo 'if [ -n "$PRISMA_RESOLVE_FAILED" ]; then' >> /app/start.sh && \
    echo '  echo "Resolving failed Prisma migration: $PRISMA_RESOLVE_FAILED"' >> /app/start.sh && \
    echo '  npx prisma migrate resolve --rolled-back "$PRISMA_RESOLVE_FAILED" || true' >> /app/start.sh && \
    echo 'fi' >> /app/start.sh && \
    echo 'echo "Running database migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 4005

# Use the startup script
CMD ["/app/start.sh"]
