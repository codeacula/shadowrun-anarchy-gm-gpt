# Shadowrun Anarchy GPT Memory API

A Fastify/TypeScript web API to store and retrieve campaign data for the Shadowrun Anarchy GPT assistant.

## Features

- CRUD operations for Shadowrun Anarchy campaigns, sessions, characters, and arbitrary data
- Discord integration for fetching and sending messages
- API key authentication
- MongoDB integration for data persistence
- OpenAPI/Swagger documentation
- Dockerized for easy deployment

## API Endpoints

### Campaign Management

- `GET /campaigns` - List all campaigns
- `GET /campaigns/:id` - Get a specific campaign
- `POST /campaigns` - Create a new campaign
- `PUT /campaigns/:id` - Update a campaign
- `DELETE /campaigns/:id` - Delete a campaign

### Session Management

- `GET /sessions` - List all sessions
- `GET /sessions/:id` - Get a specific session
- `GET /sessions/campaign/:campaignId` - Get all sessions for a campaign
- `POST /sessions` - Create a new session
- `PUT /sessions/:id` - Update a session
- `DELETE /sessions/:id` - Delete a session

### Character Management

- `GET /characters` - List all characters
- `GET /characters/:id` - Get a specific character
- `GET /characters/campaign/:campaignId` - Get all characters for a campaign
- `POST /characters` - Create a new character
- `PUT /characters/:id` - Update a character
- `DELETE /characters/:id` - Delete a character

### Data Management

- `GET /data` - List all data
- `GET /data/:id` - Get a specific data entry
- `GET /data/campaign/:campaignId` - Get all data for a campaign
- `GET /data/campaign/:campaignId/key?key=<key>` - Get data by key for a campaign
- `POST /data/campaign/:campaignId` - Create or update data for a campaign
- `DELETE /data/:id` - Delete data by ID
- `DELETE /data/campaign/:campaignId/key?key=<key>` - Delete data by key

### Discord Integration

- `GET /discord/messages?channelId=<channelId>&limit=<limit>` - Get messages from a Discord channel
- `POST /discord/messages` - Send a message to a Discord channel

### OpenAPI Documentation

- `GET /openapi.json` - Get the OpenAPI specification
- `GET /openapi.yml` - Get the OpenAPI specification in YAML format
- `GET /docs` - Interactive API documentation with Swagger UI
- `GET /api-info` - Get API information and endpoint URLs (useful for setup)

## Custom GPT Actions Setup

This API is designed to work seamlessly with custom GPT Actions in ChatGPT. Here's how to set it up:

### 1. Configure the API Server

1. Deploy the API to a publicly accessible server (see Docker Deployment section)
2. Set the `API_BASE_URL` environment variable to your server's URL:

   ```
   API_BASE_URL=https://your-api-domain.com
   ```

3. Make sure your `API_KEY` is set to a secure value

### 2. Add Action to Your Custom GPT

1. In your custom GPT configuration, go to "Actions"
2. Click "Create new action"
3. For the schema, you have two options:

   **Option A: Import from URL**
   - Use the import URL: `https://your-api-domain.com/openapi.yml`
   - ChatGPT will automatically import the complete API specification

   **Option B: Manual import**
   - Visit `https://your-api-domain.com/openapi.yml` and copy the YAML
   - Paste it into the schema field

### 3. Configure Authentication

1. In the Actions configuration, set up authentication:
   - Authentication type: "API Key"
   - API Key: Your secure API key
   - Auth Type: "Custom"
   - Custom Header Name: `x-api-key`

### 4. Test the Integration

Use the `/api-info` endpoint to verify your setup:

```
GET https://your-api-domain.com/api-info
```

This will return useful information about your API configuration.

### Example Custom GPT Instructions

Add this to your custom GPT instructions to help it use the memory API effectively:

```
You have access to a memory API that can store and retrieve campaign data for Shadowrun Anarchy games. Use the /data endpoints to:
- Store arbitrary JSON data with descriptive keys
- Retrieve previously stored information about campaigns, characters, and sessions
- Maintain continuity across conversations

Always use the campaignId to organize data, and use descriptive keys like "character_john_doe", "session_notes_2024_01_15", etc.
```

## Prerequisites

- Node.js 16+ (18 LTS recommended)
- MongoDB 5+
- Discord bot token (optional, for Discord integration)

## Installation

### Local Development

1. Clone the repository:

   ```
   git clone https://github.com/codeacula/shadowrun-anarchy-gm-gpt.git
   cd shadowrun-anarchy-gm-gpt/memory-api
   ```

2. Install dependencies:

   ```
   npm install
   ```

3. Copy the environment example file and configure it:

   ```
   cp .env.example .env
   # Edit .env with your settings
   ```

4. Build the TypeScript code:

   ```
   npm run build
   ```

5. Start the server:

   ```
   npm start
   ```

6. Access the API at <http://localhost:3000> and documentation at <http://localhost:3000/docs>

### Docker Deployment

1. Clone the repository:

   ```
   git clone https://github.com/codeacula/shadowrun-anarchy-gm-gpt.git
   cd shadowrun-anarchy-gm-gpt/memory-api
   ```

2. Create a `.env` file with your environment variables:

   ```
   cp .env.example .env
   # Edit .env with your settings
   ```

3. Start the containers:

   ```
   docker-compose up -d
   ```

4. Access the API at <http://localhost:3000> and documentation at <http://localhost:3000/docs>

## Authentication

All API endpoints require an API key, which should be sent in the `x-api-key` header:

```
curl -H "x-api-key: your_api_key_here" http://localhost:3000/campaigns
```

## License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.
