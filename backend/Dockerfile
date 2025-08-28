FROM node:22-alpine

WORKDIR /app

COPY shared shared
RUN npm install --prefix ./shared && \
    npm run build --prefix ./shared

COPY backend backend
RUN npm install --prefix backend


EXPOSE 8000

# Start the app at runtime, not build time
CMD ["npm", "start", "--prefix", "backend"]
