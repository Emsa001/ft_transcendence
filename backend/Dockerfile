FROM node:18

# Install build tools on Debian-based image
# RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install
# RUN npm rebuild

COPY . .

EXPOSE 8000

CMD ["npx", "tsx", "src/bin/server.ts"]
