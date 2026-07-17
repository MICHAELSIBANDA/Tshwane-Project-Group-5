FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ENV NODE_ENV=development
RUN npm run build

EXPOSE 3001

CMD ["npm", "run", "dev"]
