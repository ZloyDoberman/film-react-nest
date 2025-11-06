FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm i

COPY . .
RUN npm run build

FROM node:20-alpine as production

WORKDIR /app
COPY --from=builder /app/dist ./dist

VOLUME /app/dist