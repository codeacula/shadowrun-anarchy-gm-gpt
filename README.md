# Shadowrun Anarchy GPT Project

This repository contains multiple implementations for managing Shadowrun Anarchy RPG campaigns:

1. **ShadowrunGptMemory** - A C# WebAPI project designed to manage users, campaigns, sessions, and characters in a data-oriented and domain-driven manner.

2. **Memory API** - A Fastify/TypeScript web API for storing and retrieving campaign data with Discord integration. See [memory-api/README.md](memory-api/README.md) for details.

## ShadowrunGptMemory

The C# WebAPI project includes several key components:

- **Api**: Contains the WebAPI controllers that handle HTTP requests and responses.
  - **Controllers**: Includes controllers for managing users, campaigns, sessions, characters, and administrative tasks.
- **Domain**: Defines the core business logic and entities.
  - **Entities**: Represents the main data models such as User, Campaign, Session, and Character.
  - **Services**: Contains domain services for business operations.
  - **Repositories**: Interfaces for data access operations.
- **Infrastructure**: Implements data access and authentication mechanisms.
  - **Data**: Contains the database context for Entity Framework.
  - **Repositories**: Implements the repository pattern for data access.
  - **Auth**: Configures OAuth2 authentication.

## Memory API

The Fastify/TypeScript web API provides:

- CRUD operations for campaigns, sessions, characters, and arbitrary data
- Discord integration for fetching and sending messages
- API key authentication
- MongoDB integration
- OpenAPI documentation
- Docker containerization

See [memory-api/README.md](memory-api/README.md) for complete details.

## Features

- **User Management**: Create, update, and delete users.
- **Campaign Management**: Manage campaigns, including creation and updates.
- **Session Management**: Start and end gaming sessions.
- **Character Management**: Create and update character information.
- **Admin Functionality**: Special administrative tasks for managing the application.

## Setup Instructions

### ShadowrunGptMemory (C#)

1. Clone the repository:
   ```
   git clone https://github.com/codeacula/shadowrun-anarchy-gm-gpt.git
   ```

2. Navigate to the project directory:
   ```
   cd shadowrun-anarchy-gm-gpt/src/ShadowrunGptMemory.Api
   ```

3. Restore the dependencies:
   ```
   dotnet restore
   ```

4. Run the application:
   ```
   dotnet run
   ```

5. Access the API documentation and endpoints via Swagger or Postman.

### Memory API (Fastify/TypeScript)

1. Navigate to the memory-api directory:
   ```
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

6. Access the API at http://localhost:3000 and documentation at http://localhost:3000/docs

Alternatively, use Docker Compose:
```
cd shadowrun-anarchy-gm-gpt/memory-api
docker-compose up -d
```

## Usage Guidelines

- Ensure you have the necessary OAuth2 credentials configured in `appsettings.json`.
- Use the provided controllers to interact with the API for managing users, campaigns, sessions, and characters.
- Follow best practices for API consumption and error handling.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.