FROM node:18-alpine
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn

COPY . .
EXPOSE 42069

RUN apk add --no-cache openssl
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/CN=localhost"

# using ts-node directly to avoid module resolution issues
CMD ["yarn", "dev"]