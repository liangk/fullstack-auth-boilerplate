# Production Dockerfile for Railway deployment
FROM node:20-alpine

WORKDIR /app

# Install OpenSSL to fix Prisma SSL warnings
RUN apk add --no-cache openssl

# Copy package files
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

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
    echo 'echo "Running Prisma migrations..."' >> /app/start.sh && \
    echo 'npx prisma migrate deploy' >> /app/start.sh && \
    echo 'echo "Starting application..."' >> /app/start.sh && \
    echo 'node dist/index.js' >> /app/start.sh && \
    chmod +x /app/start.sh

# Expose port
EXPOSE 4000

# Use the startup script
CMD ["/app/start.sh"]
