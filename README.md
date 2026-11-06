# Slack Backend

A lightweight backend for a Slack-inspired collaboration platform built with Node.js, Express, MongoDB, and Mongoose. It supports user authentication, workspace management, workspace member roles, and channel-based communication flows.

## Features

- User sign up and sign in with JWT-based authentication
- Workspace creation and listing for authenticated users
- Workspace member management with admin and member roles
- Join workspaces using a generated join code
- Channel creation, retrieval, update, and deletion inside a workspace
- Paginated message retrieval for workspace channels
- Request validation with Zod
- Centralized error handling and consistent API responses
- MongoDB persistence with Mongoose models

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- Redis + BullMQ for queued bulk email delivery
- Nodemailer for SMTP email delivery and the server startup email check
- JWT for authentication
- Zod for validation
- ESLint + Prettier for code quality

## Project Structure

```text
Slack/
├── src/
│   ├── config/          # DB and server configuration
│   ├── controllers/     # Request handlers
│   ├── middlewares/     # Authentication middleware
│   ├── queues/          # BullMQ queue configuration
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── schema/          # Mongoose models
│   ├── service/         # Business logic
│   ├── templates/       # Email templates
│   ├── utils/           # Shared helpers and errors
│   ├── validators/      # Zod validation schemas
│   ├── workers/         # Background job processors
│   ├── server.js        # App bootstrap
│   └── ...
├── .env                 # Environment variables
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
└── package-lock.json
```

## Prerequisites

Before running this project, make sure you have:

- Node.js 20.19+, 22.13+, or 24+
- MongoDB running locally or a MongoDB Atlas connection string
- Redis running locally or an accessible Redis service
- An SMTP server and credentials for the startup email check and bulk email
- A terminal environment with npm installed

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Vineeth-28/Slack-Backend.git
cd Slack-Backend
```

2. Install dependencies:

```bash
npm install
```

3. Create a .env file in the project root with the following values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/Slack
JWT_SECRET=your_super_secret_key
JWT_EXPIRY=1h
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_USERNAME=
REDIS_PASSWORD=
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=you@example.com
TEST_EMAIL=you@example.com
FRONTEND_URL=http://localhost:3000
```

Redis credentials are optional for servers that do not require authentication.
`SMTP_FROM` defaults to `SMTP_USER` when omitted. On startup, the server connects
to MongoDB and attempts to send a test email to `TEST_EMAIL`; configure valid
SMTP settings and a test recipient to complete that check. A startup task error
is logged if the database or email check fails, but the HTTP server still starts.

## Running the Server

Start the application in development mode:

```bash
npm run dev
```

This will run the app with nodemon for automatic restarts during development.

For a normal start:

```bash
node src/server.js
```

Run one or more email workers in separate processes to process queued mail:

```bash
npm run worker:email
```

Each worker shares a queue-wide BullMQ limiter, so email delivery is capped at
100 messages per minute across worker processes. Failed sends are retried up to
five times with exponential backoff. Redis must be available to both the API and
worker processes.

## Health Check

The server exposes a basic health endpoint:

```bash
GET /health
```

Example response:

```json
{
  "message": "pong"
}
```

## API Overview

The backend is mounted under /api and versioned under /v1.

### Authentication

```http
POST /api/v1/users/signup
POST /api/v1/users/signIn
```

### Bulk email

```http
POST /api/v1/emails/bulk
X-Access-Token: <JWT>
Content-Type: application/json
```

The authenticated endpoint queues one job per recipient and accepts up to 100
unique email addresses per request (case-insensitive uniqueness). The subject
must be 1-200 characters, and at least one of `text` or `html` is required. Each
content field is limited to 20,000 characters, and the sender is always
`SMTP_FROM`.

```json
{
  "recipients": ["one@example.com", "two@example.com"],
  "subject": "An update from Slack",
  "text": "Here is the latest update."
}
```

When Redis accepts the jobs, the endpoint responds with HTTP 202. Sending is
asynchronous and limited to 100 emails per minute across workers.

```json
{
  "success": true,
  "message": "Emails queued successfully",
  "data": {
    "batchId": "generated-batch-id",
    "queued": 2
  }
}
```

### Workspaces

```http
POST /api/v1/workspaces
GET /api/v1/workspaces
GET /api/v1/workspaces/:workspaceId
POST /api/v1/workspaces/join
POST /api/v1/workspaces/:workspaceId/members
PATCH /api/v1/workspaces/:workspaceId/members/:memberId
DELETE /api/v1/workspaces/:workspaceId
```

### Channels

```http
POST /api/v1/workspaces/:workspaceId/channels
GET /api/v1/workspaces/:workspaceId/channels
GET /api/v1/workspaces/:workspaceId/channels/:channelId
PATCH /api/v1/workspaces/:workspaceId/channels/:channelId
DELETE /api/v1/workspaces/:workspaceId/channels/:channelId
```

### Messages

Retrieve messages from a channel. The authenticated user must be a member of the
workspace, and the channel must belong to that workspace.

```http
GET /api/v1/workspaces/:workspaceId/channels/:channelId/messages?page=1&limit=20
X-Access-Token: <JWT>
```

For example, with `curl`:

```bash
curl "http://localhost:3000/api/v1/workspaces/<workspaceId>/channels/<channelId>/messages?page=1&limit=20" \
  -H "X-Access-Token: <JWT>"
```

Both query parameters are optional. `page` defaults to `1`; `limit` defaults to
`20` and must be between `1` and `100`. Messages are returned newest first, with
the sender's username, email, and avatar included. A page beyond the available
messages returns an empty `data` array; the response does not include a total
count or additional pagination metadata.

Invalid pagination values return HTTP 400. Requests without a valid token are
rejected, and a user who is not a member of the workspace cannot read its
messages. A channel that does not belong to the requested workspace returns
HTTP 404.

Example response:

```json
{
  "success": true,
  "message": "Messages fetched successfully",
  "data": [
    {
      "_id": "message-id",
      "body": "Hello, everyone!",
      "channelId": "channel-id",
      "senderId": {
        "_id": "user-id",
        "username": "alex",
        "email": "alex@example.com",
        "avatar": "https://example.com/avatar.png"
      },
      "workspace": "workspace-id",
      "createdAt": "2026-11-06T12:00:00.000Z",
      "updatedAt": "2026-11-06T12:00:00.000Z"
    }
  ],
  "error": []
}
```

## Authentication Flow

- Users sign up with email, username, and password.
- Passwords are hashed before storage.
- Users sign in to receive a JWT token.
- Protected routes require the JWT token in the `X-Access-Token` header.

## Notes

- Usernames are unique and restricted to letters, numbers, and underscores.
- Workspaces support admin and member roles.
- Join codes are used to add members to workspaces.
- Channels are associated with a specific workspace and managed by authenticated users.

## Scripts

```bash
npm run dev        # start the server in development mode
npm run lint       # run ESLint checks
npm run lint:fix   # auto-fix lint issues
npm run format     # format code with Prettier
npm run format:check
npm test           # run the test suite
```

The test command currently finds no test files, so it exits successfully with
zero tests.

## License

This project is licensed under the ISC License.

## Author

Vineeth-28
