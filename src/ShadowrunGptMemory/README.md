# ShadowrunGptMemory

## Overview
ShadowrunGptMemory is a Node.js application built with TypeScript and Express.js that provides a WebAPI for managing users, campaigns, sessions, and characters in a Shadowrun-themed role-playing game. The application uses Mongoose to interact with a MongoDB database.

## Features
- User management (create, read, update, delete)
- Campaign management (create, read, update, delete)
- Session management (create, read, update, delete)
- Character management (create, read, update, delete)
- Authentication middleware for secure routes

## Project Structure
```
ShadowrunGptMemory
├── src
│   ├── app.ts
│   ├── controllers
│   │   ├── userController.ts
│   │   ├── campaignController.ts
│   │   ├── sessionController.ts
│   │   └── characterController.ts
│   ├── models
│   │   ├── User.ts
│   │   ├── Campaign.ts
│   │   ├── Session.ts
│   │   └── Character.ts
│   ├── routes
│   │   ├── userRoutes.ts
│   │   ├── campaignRoutes.ts
│   │   ├── sessionRoutes.ts
│   │   └── characterRoutes.ts
│   ├── middleware
│   │   └── auth.ts
│   └── types
│       └── index.ts
├── package.json
├── tsconfig.json
├── openapi.yaml
└── README.md
```

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- MongoDB (local or cloud instance)

### Installation
1. Clone the repository:
   ```
   git clone https://github.com/yourusername/ShadowrunGptMemory.git
   ```
2. Navigate to the project directory:
   ```
   cd ShadowrunGptMemory
   ```
3. Install the dependencies:
   ```
   npm install
   ```

### Configuration
- Update the MongoDB connection string in `src/app.ts` to point to your database.

### Running the Application
To start the application, run:
```
npm start
```
The server will start on the specified port (default is 3000).

### API Documentation
Refer to the `openapi.yaml` file for detailed API specifications, including endpoints, request/response formats, and authentication methods.

## Contributing
Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

## License
This project is licensed under the MIT License. See the LICENSE file for details.