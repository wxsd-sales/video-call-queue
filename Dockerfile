FROM node:lts/iron AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --loglevel verbose

COPY . ./
RUN npm run build

CMD ["sh", "-c", "npx vite preview --host 0.0.0.0 --port 3000"]
