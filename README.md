# Slack Backend

A lightweight backend for a Slack-inspired collaboration platform built with Node.js, Express, MongoDB, and Mongoose. It supports user authentication, workspace management, workspace member roles, and channel-based communication flows.

## Features

- User sign up and sign in with JWT-based authentication
- Workspace creation and listing for authenticated users
- Workspace member management with admin and member roles
- Join workspaces using a generated join code
- Channel creation, retrieval, update, and deletion inside a workspace
- Request validation with Zod
- Centralized error handling and consistent API responses
- MongoDB persistence with Mongoose models

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
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
│   ├── repositories/    # Data access layer
│   ├── routes/          # API route definitions
│   ├── schema/          # Mongoose models
│   ├── service/         # Business logic
│   ├── utils/           # Shared helpers and errors
│   ├── validators/      # Zod validation schemas
│   ├── server.js        # App bootstrap
│   └── ...
├── test/                # Test files
├── .env                 # Environment variables
├── .gitignore
├── eslint.config.js
├── package.json
├── README.md
└── package-lock.json
```

## Prerequisites

Before running this project, make sure you have:

- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection string
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
```

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

## Authentication Flow

- Users sign up with email, username, and password.
- Passwords are hashed before storage.
- Users sign in to receive a JWT token.
- Protected routes require the JWT token in the authorization flow used by the application middleware.

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

## License

This project is licensed under the ISC License.

## Author

Vineeth-28
