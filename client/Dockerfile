# Dockerfile for React client (Vite)

# Use modern Node LTS compatible with Vite/React
FROM node:20-alpine AS build

WORKDIR /usr/src/app

COPY package*.json ./

# Install dependencies
RUN npm ci --silent

# Copy source
COPY . .

# Build production assets
RUN npm run build

# Runtime image
FROM node:20-alpine AS runtime
WORKDIR /usr/src/app

# Only copy what's needed to run preview server
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/dist ./dist

# Install all deps including vite (needed for preview server)
RUN npm ci --silent

ENV PORT=3000
EXPOSE 3000

# Start Vite preview server on all interfaces
CMD ["npm","start"]