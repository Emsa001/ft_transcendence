FROM node:24-alpine

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend ./
COPY shared ../shared

EXPOSE 3000

# Start the app at runtime, not build time
CMD ["npm", "start"]
