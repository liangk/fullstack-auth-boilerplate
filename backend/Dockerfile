# Backend Dockerfile
FROM node:20

# Install build dependencies for native modules
RUN apt-get update && apt-get install -y \
    python3 \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Rebuild bcrypt for the current architecture
RUN npm rebuild bcrypt --build-from-source

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Default command (can be overridden in docker-compose)
CMD ["npm", "run", "dev"]
