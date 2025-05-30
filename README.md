# Djiguiya Health Cards API

## Description

A comprehensive API for managing the Djiguiya Health Cards system. This system facilitates operations related to health card issuance, user management, partner integrations, and service consumption tracking.

## Features

-   **User Authentication and Authorization:** Secure access to the API using JWT and role-based access control.
-   **User Management:** CRUD operations for users, profile management.
-   **Health Card Management:** Issuance, activation, deactivation, and tracking of health cards.
-   **Partner Management:** Onboarding and management of partner organizations.
-   **Service Catalog and Management:** Defining and managing services offered within the system.
-   **Subscriber Management:** Handling information related to card subscribers.
-   **Consumption Tracking:** Recording and monitoring the consumption of services by cardholders.
-   **Warranty Management:** Managing warranty information associated with services or products.
-   **Categorization of Services/Products:** Organizing services and products into categories.
-   **Management of Organizational Structures:** Defining and managing different organizational structures or entities within the system.
-   **Application Configuration:** Centralized configuration management.
-   **Database Management:** Includes setup, and potentially migrations and seeding.

## Technologies Used

-   **Backend Framework:** NestJS (Progressive Node.js framework)
-   **Programming Language:** TypeScript
-   **Database:** PostgreSQL (inferred from 'pg' dependency)
-   **ORM:** TypeORM (inferred from '@nestjs/typeorm' dependency)
-   **Containerization:** Docker (recommended for consistent development and deployment)
-   **API Documentation:** Swagger (OpenAPI) via `@nestjs/swagger`
-   **Package Manager:** pnpm

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Make sure you have the following software installed on your system:

-   [Node.js](https://nodejs.org/) (A recent LTS version is recommended, e.g., v18, v20)
-   [pnpm](https://pnpm.io/installation) (Version `9.12.0` as specified in `packageManager`)
-   [Docker](https://www.docker.com/get-started) and [Docker Compose](https://docs.docker.com/compose/install/) (Recommended for managing services like PostgreSQL locally)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    # Replace <repository-url> with the actual URL of the repository
    cd djiguiya-backend # Or your repository's directory name
    ```

2.  **Install dependencies using pnpm:**

    ```bash
    pnpm install
    ```

3.  **Set up environment variables:**

    Create a `.env` file in the root of the project. You might need to copy it from an example file if provided (e.g., `cp .env.example .env`).
    Update the `.env` file with your local configuration (e.g., database credentials, JWT secret, `PORT`).

### Running the Application

```bash
# Development mode with watch (restarts on file changes)
pnpm run start:dev

# Build the application for production
pnpm run build

# Start the production build
pnpm run start:prod

# Start in debug mode with watch
pnpm run start:debug
```

The application will typically run on `http://localhost:3000` unless a different `PORT` is specified in your `.env` file.

### Running Tests

-   **Run unit tests:**

    ```bash
    pnpm run test
    ```

-   **Run test coverage report:**

    ```bash
    pnpm run test:cov
    ```

-   **Run end-to-end (E2E) tests:**

    ```bash
    pnpm run test:e2e
    ```
    Ensure your database and any other required services are running for E2E tests.

## API Documentation

API documentation is automatically generated using Swagger (OpenAPI). Once the application is running, you can access the Swagger UI at:

`http://localhost:<PORT>/api/docs`

Replace `<PORT>` with the port the application is running on (default is `3000`, as seen in `src/main.ts` or your `.env` file).

## Project Structure

The project follows a modular structure, typical of NestJS applications, located primarily within the `src/` directory:

-   `main.ts`: The entry point of the application, responsible for bootstrapping NestJS, setting up Swagger, global pipes, and interceptors.
-   `app.module.ts`: The root module that orchestrates other feature and helper modules.
-   **Core Feature Modules:**
    -   `AuthModule`: Handles authentication (JWT, Passport) and authorization (guards).
    -   `UsersModule`: Manages user data, profiles, and related operations.
    -   `CardsModule`: Responsible for health card creation, management, and lifecycle.
    -   `PartnersModule`: Manages information and interactions related to external partners.
    -   `ServicesModule`: Defines and manages the services available in the system.
    -   `SubscribersModule`: Handles data and operations for health card subscribers.
    -   `WarrantiesModule`: Manages warranty information linked to services or products.
    -   `CategoriesModule`: Organizes services, products, or other entities into categories.
    -   `ConsumptionModule`: Tracks the usage and consumption of services.
    -   `StructuresModule`: Manages different organizational structures or entities within the platform.
-   **Helper Modules:**
    -   `AppConfigModule` (`config/`): Manages application configuration, potentially using `@nestjs/config`.
    -   `DatabaseModule` (`database/`): Configures the database connection (TypeORM, PostgreSQL), manages entities, and may include seed services.
-   `common/` or `commons/`: Often contains shared utilities, decorators, guards, interceptors, DTOs, etc. (Presence inferred from `src/main.ts` mentioning `LoggingInterceptor` from `commons/interceptors`).

## Contributing

Contributions are welcome! Please follow a standard GitHub flow:
1.  Fork the repository.
2.  Create a new branch for your feature or bug fix (`git checkout -b feature/your-feature` or `bugfix/your-bugfix`).
3.  Make your changes and commit them with clear, descriptive messages.
4.  Push your changes to your forked repository.
5.  Create a Pull Request against the `main` (or `develop`) branch of the original repository.

Please ensure your code adheres to any linting and formatting rules (`pnpm run lint`, `pnpm run format`).

## License

This project is **UNLICENSED** (as specified in `package.json`).

If this is intended to be an open-source project, please consider adding a license file (e.g., `LICENSE.md`) and choosing an appropriate license like MIT, Apache 2.0, or GPL.
