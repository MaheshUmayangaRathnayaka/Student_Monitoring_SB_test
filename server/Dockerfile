#  Dockerfile for Node Express Backend

FROM node:18-alpine

# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm ci --only=production

# Copy app source code
COPY . .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodeuser -u 1001

# Change ownership of the app directory
RUN chown -R nodeuser:nodejs /usr/src/app
USER nodeuser

# Exports
EXPOSE 5000

CMD ["npm","start"]