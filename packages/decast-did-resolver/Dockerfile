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

# Build the resolver
WORKDIR /app/packages/decast-did-resolver
RUN pnpm build

# Production stage
FROM node:22-alpine AS production

# Install pnpm
RUN npm install -g pnpm@8.15.0

# Create app user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S resolver -u 1001

# Set working directory
WORKDIR /app

# Copy built package
COPY --from=base --chown=resolver:nodejs /app/packages/decast-did-resolver/dist ./dist
COPY --from=base --chown=resolver:nodejs /app/packages/decast-did-resolver/package.json ./package.json

# Switch to non-root user
USER resolver


# Set environment variables
ENV NODE_ENV=production

# Start the resolver (if it has a server component)
# For now, just keep the container running for package access
CMD ["node", "-e", "console.log('Decast DID Resolver package built successfully!'); console.log('Package available at /app/dist'); process.exit(0)"]
