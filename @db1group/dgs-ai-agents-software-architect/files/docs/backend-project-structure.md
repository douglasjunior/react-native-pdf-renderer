# Backend Project Structure

This document describes the modern and scalable backend architecture based on Clean Architecture, SOLID principles, and Domain-Driven Design (DDD).

## Architecture Overview

The backend follows a layered architecture pattern with clear separation of concerns:

```
src/
├── domain/                     # Domain Layer (Core Business Logic)
│   ├── entities/              # Domain entities
│   ├── value-objects/         # Value objects
│   ├── repositories/          # Repository interfaces
│   ├── services/              # Domain services
│   └── events/                # Domain events
├── application/               # Application Layer (Use Cases)
│   ├── use-cases/             # Application use cases
│   ├── services/              # Application services
│   ├── dto/                   # Data Transfer Objects
│   └── ports/                 # Application ports/interfaces
├── infrastructure/            # Infrastructure Layer (External Concerns)
│   ├── repositories/          # Repository implementations
│   ├── database/              # Database configurations
│   ├── external-services/     # External API clients
│   ├── file-storage/          # File system operations
│   └── messaging/             # Message queue implementations
├── presentation/              # Presentation Layer (API/Controllers)
│   ├── controllers/           # HTTP controllers
│   ├── middlewares/           # Request middlewares
│   ├── validators/            # Input validation
│   └── serializers/           # Response serializers
└── shared/                    # Shared utilities
    ├── container/             # Dependency injection container
    ├── utils/                 # Utility functions
    ├── constants/             # Application constants
    └── types/                 # TypeScript type definitions
```

## Layer Responsibilities

### Domain Layer
- Contains core business logic and rules
- Defines entities, value objects, and domain services
- Declares repository interfaces (dependency inversion)
- Independent of external frameworks and technologies

### Application Layer
- Contains use cases (application business logic)
- Orchestrates domain objects to fulfill use cases
- Defines application services and DTOs
- Depends only on the domain layer

### Infrastructure Layer
- Implements repository interfaces
- Handles database operations and external services
- Manages file system operations and messaging
- Contains framework-specific implementations

### Presentation Layer
- Handles HTTP requests and responses
- Contains controllers, middleware, and validation
- Responsible for API documentation and serialization
- Depends on application layer

## Key Principles

### Clean Architecture
- Dependencies point inward toward the domain
- Domain layer has no external dependencies
- Infrastructure implements interfaces defined in inner layers

### SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes must be substitutable for their base types
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Inversion**: Depend on abstractions, not concretions

### Domain-Driven Design
- Rich domain model with business logic
- Ubiquitous language throughout the codebase
- Clear boundaries between bounded contexts
- Domain events for cross-context communication

## Dependency Injection

The application uses a simple dependency injection container to manage dependencies:

```typescript
// Container manages object lifecycle and dependencies
const container = new Container();

// Register repository implementations
container.register<IUserRepository>('UserRepository', UserRepository);
container.register<IFileRepository>('FileRepository', FileRepository);

// Register services
container.register<UserService>('UserService', UserService);

// Resolve dependencies
const userService = container.resolve<UserService>('UserService');
```

## File Upload Handling

All file operations are centralized in the infrastructure layer:

```typescript
// File paths are relative to the 'uploads' directory
const uploadsPath = path.join(process.cwd(), 'uploads');

// File operations are abstracted through interfaces
interface IFileStorageService {
  save(file: Buffer, filename: string): Promise<string>;
  delete(filename: string): Promise<void>;
  read(filename: string): Promise<Buffer>;
}
```

## Migration Guidelines

When refactoring existing code to this architecture:

1. **Move entities to domain layer**: Extract business logic from data models
2. **Create repository interfaces**: Define contracts in domain layer
3. **Implement repositories**: Move data access logic to infrastructure
4. **Extract use cases**: Move business workflows to application layer
5. **Update imports**: Fix import paths according to new structure
6. **Configure DI container**: Register all dependencies
7. **Update file paths**: Ensure upload operations use correct paths

## Benefits

- **Testability**: Easy to mock dependencies and test in isolation
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features without affecting existing code
- **Flexibility**: Easy to swap implementations (e.g., database providers)
- **Reusability**: Domain logic can be reused across different interfaces