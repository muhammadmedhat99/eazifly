# --------------------
# Build stage
FROM node:20-alpine AS builder

# Set working dir
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# --------------------
# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Copy only needed files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Install only production dependencies
RUN npm ci --only=production

EXPOSE 3000

# Use next's production start
CMD ["npm", "run", "start"]
