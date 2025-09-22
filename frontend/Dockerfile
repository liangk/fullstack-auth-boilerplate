# Frontend Dockerfile
# Multi-stage build: build stage
FROM node:20-alpine as build

WORKDIR /app

# Copy package files and lock file
COPY package*.json package-lock.json ./

# Install dependencies with exact versions from lock file
RUN npm ci --prefer-offline --no-audit

# Verify exact version of ngx-lite-form
RUN npm list ngx-lite-form || echo "ngx-lite-form version check failed"

# Copy source code
COPY . .

# Build the application
RUN npm run build --prod

# Production stage
FROM nginx:alpine

# Copy built app from build stage
COPY --from=build /app/dist/frontend /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
