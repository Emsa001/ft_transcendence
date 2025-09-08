FROM node:22-alpine

WORKDIR /app/backend

COPY backend ./
COPY shared ../shared
RUN npm install --prefix ../shared
RUN npm run build --prefix ../shared

RUN npm install

# Copy backend and shared

EXPOSE 8000

CMD ["npm", "start"]
