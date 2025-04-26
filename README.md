# AccessGate Core

AccessGate Core is a Fastify-based backend service that provides authorization and policy management functionality. It's built with TypeScript and follows modern development practices.

## Features

- Fast and efficient API server using Fastify
- Environment configuration management
- Health check endpoints
- Authorization routes
- Policy management
- TypeScript support
- Comprehensive testing setup with Vitest

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/access-gate-tech/accessgate-core.git
cd accessgate-core
```

2. Install dependencies:

```bash
npm install
```

## Configuration

The application uses environment variables for configuration. Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
# Add other required environment variables
```

## Development

To start the development server:

```bash
npm run dev
```

This will start the server with hot-reload enabled.

## Building

To build the project:

```bash
npm run build
```

This will compile the TypeScript code into JavaScript in the `dist` directory.

## Testing

The project uses Vitest for testing. Available test commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Project Structure

```
accessgate-core/
├── src/
│   ├── main.ts           # Application entry point
│   ├── plugins/          # Fastify plugins
│   └── routes/           # API routes
├── test/                 # Test files
├── package.json          # Project dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## API Endpoints

- Health Check: `/healthz`
- Authorization: `/authorize`
- Policies: `/policies`

## Dependencies

### Main Dependencies

- Fastify: High-performance web framework
- @fastify/cors: CORS support
- @fastify/env: Environment configuration
- @fastify/helmet: Security headers
- Zod: Schema validation

### Development Dependencies

- TypeScript
- Vitest: Testing framework
- ts-node-dev: Development server
- pino-pretty: Logging

## License

This project is licensed under the terms of the license included in the repository.

## Contributing

Please read the contributing guidelines before submitting pull requests.

## Support

For support, please open an issue in the repository.
