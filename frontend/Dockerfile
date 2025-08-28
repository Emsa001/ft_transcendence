FROM node:22-alpine

WORKDIR /app

COPY shared shared
RUN npm install --prefix ./shared && \
    npm run build --prefix ./shared

COPY frontend frontend
RUN npm install --prefix frontend


EXPOSE 8000

# Start the app at runtime, not build time
CMD ["npm", "start", "--prefix", "frontend"]
