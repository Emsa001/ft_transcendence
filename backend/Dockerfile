FROM node:22

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

# Copy backend and shared
COPY backend ./
COPY shared ../shared

EXPOSE 8000

CMD ["npm", "start"]
