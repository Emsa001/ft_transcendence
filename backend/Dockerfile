FROM node:24-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 8000

# Start the app at runtime, not build time
CMD ["npm", "start"]
