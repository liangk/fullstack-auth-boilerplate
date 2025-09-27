# ---- Builder Stage ----
# This stage builds the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for building)
RUN npm install

# Copy the rest of the source code
COPY . .

# Generate Prisma Client to ensure it's available for the build
# Provide a dummy DATABASE_URL to satisfy Prisma validation during build.
# The real DATABASE_URL will be injected at runtime.
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" npx prisma generate

# Build the TypeScript project
RUN npm run build

# ---- Production Stage ----
# This stage creates the final, lean image
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests and install *only* production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Prisma schema for runtime migration
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 4000

# The command to run in production.
# This runs migrations and then starts the server.
CMD ["npm", "run", "start:prod"]
