# Stage 1: Build React app
FROM node:24-alpine AS build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
COPY shared ../shared
RUN npm run build   
# produces /dist

# Stage 2: NGINX
FROM nginx:alpine

# Copy React build
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Copy Nginx config
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Copy certificates
COPY nginx/certs /etc/nginx/certs

# Make sure nginx can read files
RUN chmod -R 755 /usr/share/nginx/html

EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]
