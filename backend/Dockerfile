# Builder
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./

RUN npm ci
COPY . .

RUN npm run build

# Distribution
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/dist /app/dist

EXPOSE 8081

CMD ["node", "dist/src/server.js"]
