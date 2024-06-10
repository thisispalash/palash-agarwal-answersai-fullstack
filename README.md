## AnswersAi Coding Assessment
> [Task Description](https://answersai.notion.site/AnswersAi-Full-Stack-Technical-Assessment-f1beccc336374848a7accd472f7630b4)

**Docs**
- [API](./docs/api.md): List of api endpoints and websocket events.
- [client](./docs/client.md): Information about the client side code.
- [server](./docs/server.md): Information about the server code and architecture.
- [cloud](./docs/cloud.md): Scalability architecture description.

## Running Instructions

- `mkdir repo && cd repo`
- `git clone https://github.com/thisispalash/palash-agarwal-answersai-fullstack.git .`

**Docker**
> Assumes Docker Desktop and `docker-compose` are installed

- Start [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- `docker-compose up --build`
- Navigate to [https://localhost:3000](https://localhost:3000)
- Enjoy!

**Local**
> assumes macOS and [`mongod`](https://www.mongodb.com/docs/manual/reference/program/mongod/#mongodb-binary-bin.mongod) [installation](https://www.mongodb.com/docs/manual/administration/install-community/)

- Open three terminals
- Terminal 1
  - `mkdir db`
  - `cd db`
  - `mongod --dbpath .`
- Terminal 2
  - `cd server`
  - `cp .env.example .env`
  - Get a new api key from [OpenAI](https://platform.openai.com/api-keys) and enter it against `OPENAI_API_SECRET` in `.env`
  - `openssl req -nodes -new -x509 -keyout server.key -out server.cert -subj "/CN=localhost"`
  - `yarn && yarn dev`
- Terminal 3
  - `cd client`
  - `cp .env.example .env.local`
  - `openssl req -nodes -new -x509 -keyout client.key -out client.cert -subj "/CN=localhost"`
  - `yarn && yarn dev`
- Navigate to [https://localhost:3000](https://localhost:3000)
- Enjoy!