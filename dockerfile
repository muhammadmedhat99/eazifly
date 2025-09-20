# --------------------
# BUILD STAGE
# --------------------
FROM node:20-bullseye AS builder

WORKDIR /app

# Copy dependency manifests first
COPY package*.json ./

# Configure GitHub Packages auth (ARG token from GitHub Actions)
ARG NPM_TOKEN
RUN echo "@hodaelnas:registry=https://npm.pkg.github.com/" > .npmrc \
 && echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" >> .npmrc

# Accept build-time environment variables
ARG NEXT_PUBLIC_BASE_URL
ARG NEXT_PUBLIC_FIREBASE_API_KEY
ARG NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
ARG NEXT_PUBLIC_FIREBASE_PROJECT_ID
ARG NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
ARG NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
ARG NEXT_PUBLIC_FIREBASE_APP_ID
ARG NEXT_PUBLIC_FIREBASE_VAPID_KEY

# Create .env file for Next.js build
RUN echo "NEXT_PUBLIC_BASE_URL=${NEXT_PUBLIC_BASE_URL}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=${NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=${NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_APP_ID=${NEXT_PUBLIC_FIREBASE_APP_ID}" >> .env \
 && echo "NEXT_PUBLIC_FIREBASE_VAPID_KEY=${NEXT_PUBLIC_FIREBASE_VAPID_KEY}" >> .env

# Install all dependencies (including optional like sharp)
RUN npm install --include=optional

# Copy the rest of the source
COPY . .

# Build production bundle
RUN npm run build

# --------------------
# PRODUCTION STAGE
# --------------------
FROM node:20-bullseye AS runner

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.env ./
COPY --from=builder /app/.npmrc ./  # if private packages needed at runtime

# Install production dependencies only
RUN npm install --production

EXPOSE 3000
CMD ["npm", "start"]
