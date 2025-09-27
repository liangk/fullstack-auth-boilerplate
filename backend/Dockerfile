# ---- Builder Stage ----
# This stage builds the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies but ignore automatic postinstall scripts (like prisma generate)
RUN npm install --ignore-scripts

# Copy the rest of the source code
COPY . .

# Now, manually run prisma generate with the dummy database URL.
# This ensures it runs in a controlled environment.
RUN DATABASE_URL="postgresql://dummy:dummy@dummy:5432/dummy" npx prisma generate

# Build the TypeScript project
RUN npm run build

# ---- Production Stage ----
# This stage creates the final, lean image
FROM node:20-alpine

WORKDIR /app

# Copy dependency manifests and install *only* production dependencies
COPY package*.json ./
# Install production dependencies, but again, ignore postinstall scripts.
RUN npm ci --omit=dev --ignore-scripts

# Copy the built application from the builder stage
COPY --from=builder /app/dist ./dist

# Copy the Prisma schema for runtime migration
COPY --from=builder /app/prisma ./prisma

# Expose the port the app runs on
EXPOSE 4000

# The command to run in production.
# This runs migrations and then starts the server.
CMD ["npm", "run", "start:prod"]
