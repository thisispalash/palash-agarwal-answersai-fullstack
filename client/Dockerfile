# build
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
RUN yarn build


# serve
FROM node:18-alpine AS serve
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/server.js ./server.js


RUN yarn --production
EXPOSE 3000

RUN apk add --no-cache openssl
RUN openssl req -nodes -new -x509 -keyout client.key -out client.cert -subj "/CN=localhost"
CMD ["node", "server.js"]