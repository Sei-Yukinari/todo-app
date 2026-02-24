# Use node 20 as base
FROM node:20-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --production=false

# Build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next .next
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/public ./public
COPY package.json ./
EXPOSE 3000
CMD ["npm", "run", "start"]

