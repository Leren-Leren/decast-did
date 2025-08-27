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

# Build the extension
WORKDIR /app/packages/did-manager
RUN pnpm build

# Production stage - just copy the built extension
FROM alpine:latest AS production

# Install necessary tools for copying files
RUN apk add --no-cache bash

# Set working directory
WORKDIR /app

# Copy built extension
COPY --from=base /app/packages/did-manager/dist ./dist
COPY --from=base /app/packages/did-manager/manifest.json ./manifest.json

# Create a simple script to serve the extension files (for development/testing)
RUN echo '#!/bin/bash\n\
echo "Extension built successfully!"\n\
echo "Built files are in the /app/dist directory"\n\
echo "Manifest file is at /app/manifest.json"\n\
echo "To use this extension:"\n\
echo "1. Open Chrome/Edge"\n\
echo "2. Go to chrome://extensions/"\n\
echo "3. Enable Developer mode"\n\
echo "4. Click Load unpacked"\n\
echo "5. Select the /app directory"\n\
echo ""\n\
echo "Extension files:"\n\
ls -la /app\n\
echo ""\n\
echo "Keeping container running for file access..."\n\
tail -f /dev/null' > /app/start.sh && chmod +x /app/start.sh

# Expose a port for potential web server (if needed)
EXPOSE 8080

# Start the script
CMD ["/app/start.sh"]
