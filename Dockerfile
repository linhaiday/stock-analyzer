# Stock Analyzer Frontend Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY packages/web/package*.json ./packages/web/

# Install dependencies using npm install (NOT npm ci due to lock file issues)
RUN npm install && cd packages/web && npm install

# Copy source code
COPY . .

# Build
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app/packages/web

# Copy built files
COPY --from=builder /app/packages/web/dist ./dist
COPY --from=builder /app/packages/web/package*.json ./

# Install serve
RUN npm install -g vite

# Expose port
EXPOSE 5173

# Start preview server
CMD ["npm", "run", "preview:docker"]
