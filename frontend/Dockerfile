# Stage 1: Build React app
FROM node:24-alpine AS build
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install

COPY frontend ./
COPY shared ../shared
RUN npm run build  
# creates /dist

# Stage 2: NGINX
FROM nginx:alpine
COPY --from=build /app/frontend/dist /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/certs /etc/nginx/certs

EXPOSE 443
CMD ["nginx", "-g", "daemon off;"]
