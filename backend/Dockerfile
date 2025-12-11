# Production Dockerfile for Backend
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS release
WORKDIR /app
USER node
COPY --from=deps --chown=node:node /app/node_modules ./node_modules
COPY --from=deps --chown=node:node /app/package*.json ./
# Copying src directory as entry point is src/server.js
COPY --chown=node:node src ./src

EXPOSE 3000

# Using src/server.js based on repository structure
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/server.js"]
