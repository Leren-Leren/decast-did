# Use Node.js 22 Alpine as base image
FROM node:22-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy all package.json files
COPY packages/did-web/package.json ./packages/did-web/
COPY packages/did-manager/package.json ./packages/did-manager/
COPY packages/decast-did-resolver/package.json ./packages/decast-did-resolver/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY packages/did-web ./packages/did-web
COPY packages/did-manager ./packages/did-manager
COPY packages/decast-did-resolver ./packages/decast-did-resolver

# Build the application
WORKDIR /app/packages/did-web
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S app -u 1001

# Set working directory
WORKDIR /app

# Copy built application
COPY --from=base --chown=app:nodejs /app/packages/did-web/.output ./.output
COPY --from=base --chown=app:nodejs /app/packages/did-web/package.json ./package.json

# Switch to non-root user
USER app

# Expose port
EXPOSE 8080

# Set environment variables
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=8080

# Start the application
CMD ["node", ".output/server/index.mjs"]
