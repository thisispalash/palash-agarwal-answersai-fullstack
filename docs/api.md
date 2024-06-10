## API Documentation

**Routes**
> \* indicates protected routes

- `/` Returns a simple text, `Ping!`. Used to check if server is running.
- `/auth/check` Used to check if a user email exists in the db
  - **params** 
  ```ts
    email: string;
  ```
  - **codes**
  ```yaml
    200: User found
    404: User not found
    500: Internal server error
  ```
- `/auth/register` Used to register a new user. Password is sent in plaintext, hence https is important to prevent man-in-the-middle.
  - **params**
  ```ts
    email: string;
    password: string; // in plaintext
  ```
  - **codes**
  ```yaml
    201: User created
    500: Internal server error
  ```
- `/auth/login` Used to login a user. Password is sent in plaintext, hence https is important to prevent man-in-the-middle.
  - **params**
  ```ts
    email: string;
    password: string; // in plaintext
  ```
  - **codes**
  ```yaml
    200: # json
      - token: JWT Token
      - exp: Expiration timestamp
    401: Invalid password
    404: User not found
    500: Internal server error
  ```
- `/auth/session` 
  - **params**
  ```ts
    token: string; // the jwt token
  ```
  - **codes**
  ```yaml
    200: Session valid
    500: Internal server error
  ```
- *`/chat/token-usage` Used to check the token usage of the user from the db.
  - **params**
  ```ts
    email: string;
  ```
  - **codes**
  ```yaml
    # from middleware
    401: No authorization header provided # should not happen in practice, since we manage axios requests
    403: Invalid token
    # from route
    200: # json
      - actual: Tokens used by user, in absolute terms
      - limit: Daily token limit for a user
      - pct: Percentage of tokens used
    404: User not found # This should not happen in practice, since this route is only hit after logging in
    500: Internal server error
  ```
- *`/chat/start` Used to start a chat. Creates a new chat document in db and returns `id` for the WebSocket room.
  - **params**
  ```ts
    email: string;
    model: 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-4o' | 'gpt-4-turbo'; // not verified on backend
  ```
  - **codes**
  ```yaml
    # from middleware
    401: No authorization header provided # should not happen in practice, since we manage axios requests
    403: Invalid token
    # from route
    201: # json
      - _id: id of the new chat
    403: User throttled # ie, user has finished their daily quota
    404: User not found
    500: Internal server error
  ```

**WebSocket**
> event listeners more than routes \
> \* consumed by client \
> ^ consumed by server

- *`connect` Only logs to console.
- ^`connection` Only logs to console.
- ^`join` Joins a specific room.
  - **params**
  ```ts
    _id: string; // the chat-id from `/chat/start`
  ```
- ^`prompt` Sends a request to openai.
  - **params**
  ```ts
    _id: string; // the chat-id from `/chat/start`
    prompt: string; // user prompt from client
  ```
- *`reply` Sends the openai reply to the client.
  - **params**
  ```ts
    reply: string;
    usage: { // same as `/chat/token-usage`
      actual: number;
      limit: number;
      pct: number
    }
  ```
- *`error` Informs client of an error, along with an error message.
  - **params**
  ```ts
    msg: string
  ```
- ^`leave` Leaves a specific room.
  - **params**
  ```ts
    _id: string; // the chat-id from `websocket.join` and `/chat/start`
  ```
- ^*`disconnect` Only logs to console.