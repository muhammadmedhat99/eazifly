# --------------------
# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install bash & curl (needed for yarn)
RUN apk add --no-cache bash curl

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy and install deps with Yarn
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Copy source code and build
COPY . .
RUN yarn build

# --------------------
# Production stage
FROM node:20-alpine AS runner

WORKDIR /app

# Install bash & curl (for yarn runtime if needed)
RUN apk add --no-cache bash curl

# Install Yarn
RUN corepack enable && corepack prepare yarn@stable --activate

# Copy only needed files from builder
COPY --from=builder /app/package.json ./
COPY --from=builder /app/yarn.lock ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.* ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

EXPOSE 3000

# Use next's production start
CMD ["yarn", "start"]
