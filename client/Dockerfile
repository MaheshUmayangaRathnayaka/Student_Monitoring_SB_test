# ---------- BUILD STAGE ----------
FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production --no-optional

COPY . .
RUN npm run build


# ---------- PRODUCTION STAGE ----------
FROM nginx:alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built app
COPY --from=build /app/dist /usr/share/nginx/html

# Set proper permissions for nginx files
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
