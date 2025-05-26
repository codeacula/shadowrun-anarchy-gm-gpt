# ShadowrunGptMemory

ShadowrunGptMemory is a C# WebAPI project designed to manage users, campaigns, sessions, and characters in a data-oriented and domain-driven manner. The application utilizes Inversion of Control (IoC) principles and supports OAuth2 for secure user authentication.

## Project Structure

The project is organized into several key components:

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

## Features

- **User Management**: Create, update, and delete users.
- **Campaign Management**: Manage campaigns, including creation and updates.
- **Session Management**: Start and end gaming sessions.
- **Character Management**: Create and update character information.
- **Admin Functionality**: Special administrative tasks for managing the application.

## Setup Instructions

1. Clone the repository:
   ```
   git clone https://github.com/microsoft/WPF-Samples.git
   ```

2. Navigate to the project directory:
   ```
   cd ShadowrunGptMemory/src/ShadowrunGptMemory.Api
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

## Usage Guidelines

- Ensure you have the necessary OAuth2 credentials configured in `appsettings.json`.
- Use the provided controllers to interact with the API for managing users, campaigns, sessions, and characters.
- Follow best practices for API consumption and error handling.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.