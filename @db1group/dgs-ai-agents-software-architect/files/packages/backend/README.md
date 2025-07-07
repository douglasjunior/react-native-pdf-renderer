# Backend Package

This package implements a modern, scalable backend architecture following Clean Architecture, SOLID principles, and Domain-Driven Design (DDD).

## Architecture Overview

The backend is organized into distinct layers with clear separation of concerns:

### 🏛️ Domain Layer (`src/domain/`)
- **Entities**: Core business objects with behavior
- **Value Objects**: Immutable objects that describe aspects of the domain
- **Repository Interfaces**: Contracts for data access (dependency inversion)
- **Domain Services**: Business logic that doesn't belong to entities
- **Domain Events**: Events that occur within the domain

### 🚀 Application Layer (`src/application/`)
- **Use Cases**: Application business logic and workflows
- **Services**: Application services that orchestrate domain objects
- **DTOs**: Data Transfer Objects for input/output
- **Ports**: Interfaces for external dependencies

### 🔧 Infrastructure Layer (`src/infrastructure/`)
- **Repository Implementations**: Concrete implementations of repository interfaces
- **Database**: Database configurations and connections
- **External Services**: Third-party API clients
- **File Storage**: File system operations and storage
- **Messaging**: Message queue implementations

### 🌐 Presentation Layer (`src/presentation/`)
- **Controllers**: HTTP request handlers
- **Middlewares**: Request/response processing
- **Validators**: Input validation
- **Serializers**: Response formatting

### 🔗 Shared Layer (`src/shared/`)
- **Container**: Dependency injection container
- **Utils**: Utility functions and helpers
- **Constants**: Application constants
- **Types**: TypeScript type definitions

## Key Features

### ✅ Clean Architecture
- Dependencies point inward toward the domain
- Domain layer has no external dependencies
- Infrastructure implements interfaces defined in inner layers

### ✅ SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: Open for extension, closed for modification
- **Liskov Substitution**: Subtypes are substitutable for their base types
- **Interface Segregation**: Clients depend only on interfaces they use
- **Dependency Inversion**: Depend on abstractions, not concretions

### ✅ Domain-Driven Design
- Rich domain model with business logic
- Ubiquitous language throughout the codebase
- Clear boundaries between bounded contexts
- Domain events for cross-context communication

### ✅ Dependency Injection
- Simple container for managing dependencies
- Easy to test with mock implementations
- Configurable dependency resolution

### ✅ Repository Pattern
- Abstracts data access logic
- Testable with in-memory implementations
- Consistent interface across different data sources

### ✅ File Upload Handling
- Centralized file operations
- Configurable upload directory (defaults to `uploads/`)
- File validation and security
- Metadata tracking

## Usage

### Installation

```bash
npm install @db1group/dgs-ai-agents-software-architect-backend
```

### Basic Usage

```typescript
import { app } from '@db1group/dgs-ai-agents-software-architect-backend';

// Start the application
await app.start();

// Get controllers for use in your web framework
const { userController, fileController } = app.getControllers();
```

### Using Individual Components

```typescript
import { 
  User, 
  CreateUserUseCase, 
  UserRepository,
  container 
} from '@db1group/dgs-ai-agents-software-architect-backend';

// Configure dependencies
container.register('UserRepository', UserRepository);
container.registerFactory('CreateUserUseCase', () => {
  const userRepository = container.resolve('UserRepository');
  return new CreateUserUseCase(userRepository);
});

// Use the service
const createUserUseCase = container.resolve<CreateUserUseCase>('CreateUserUseCase');
const user = await createUserUseCase.execute({
  id: 'user-123',
  name: 'John Doe',
  email: 'john@example.com'
});
```

### File Upload Example

```typescript
import { UploadFileUseCase, container } from '@db1group/dgs-ai-agents-software-architect-backend';

const uploadFileUseCase = container.resolve<UploadFileUseCase>('UploadFileUseCase');

const file = await uploadFileUseCase.execute({
  file: fileBuffer,
  originalName: 'document.pdf',
  mimeType: 'application/pdf',
  uploadedBy: 'user-123'
});

console.log(`File uploaded: ${file.filename}`);
// File will be stored in uploads/user-uploads/ directory
```

## Development

### Build

```bash
npm run build
```

### Development Mode

```bash
npm run dev
```

### Testing

```bash
npm test
```

### Linting

```bash
npm run lint
```

## File Structure

```
src/
├── domain/
│   ├── entities/
│   │   ├── Entity.ts
│   │   ├── User.ts
│   │   └── File.ts
│   ├── repositories/
│   │   ├── IRepository.ts
│   │   ├── IUserRepository.ts
│   │   └── IFileRepository.ts
│   ├── services/
│   └── events/
├── application/
│   ├── use-cases/
│   │   ├── CreateUserUseCase.ts
│   │   └── UploadFileUseCase.ts
│   ├── services/
│   ├── dto/
│   └── ports/
│       └── IFileStorageService.ts
├── infrastructure/
│   ├── repositories/
│   │   ├── UserRepository.ts
│   │   └── FileRepository.ts
│   ├── file-storage/
│   │   └── FileStorageService.ts
│   ├── database/
│   ├── external-services/
│   └── messaging/
├── presentation/
│   ├── controllers/
│   │   ├── UserController.ts
│   │   └── FileController.ts
│   ├── middlewares/
│   ├── validators/
│   └── serializers/
└── shared/
    ├── container/
    │   ├── Container.ts
    │   └── config.ts
    ├── utils/
    │   └── index.ts
    ├── constants/
    │   └── app.constants.ts
    └── types/
        └── index.ts
```

## Configuration

### Upload Directory
The system uses a configurable upload directory. By default, files are stored in:
- `uploads/` - Base upload directory
- `uploads/user-uploads/` - User-uploaded files
- `uploads/temp/` - Temporary files

### File Validation
- Maximum file size: 10MB
- Allowed file types: Images, PDFs, Documents, Text files
- Automatic filename sanitization
- MIME type validation

## Migration Guide

When refactoring existing code to this architecture:

1. **Extract domain entities** from your data models
2. **Create repository interfaces** in the domain layer
3. **Implement repositories** in the infrastructure layer
4. **Create use cases** for business workflows
5. **Update imports** to use the new structure
6. **Configure dependency injection** for your services
7. **Update file paths** to use the uploads directory

## Contributing

1. Follow the established architecture patterns
2. Maintain clear separation of concerns
3. Write tests for new functionality
4. Use dependency injection for testability
5. Document public APIs with JSDoc

## License

MIT License