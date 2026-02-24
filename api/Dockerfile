# syntax=docker/dockerfile:1

# Replace build stage to use development run (ts-node-dev) to avoid running `npm run build` during image build
FROM node:22-alpine AS base
WORKDIR /app

# Install dependencies only when needed
COPY package.json package-lock.json* ./
RUN npm install --ignore-scripts

# Copy the rest of the application code
COPY . .

ENV PORT=3001
EXPOSE 3001
CMD ["npm", "run", "dev"]
