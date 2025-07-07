import { container } from './Container';

// Domain repositories (interfaces)
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { IFileRepository } from '../../domain/repositories/IFileRepository';

// Infrastructure implementations
import { UserRepository } from '../../infrastructure/repositories/UserRepository';
import { FileRepository } from '../../infrastructure/repositories/FileRepository';
import { FileStorageService } from '../../infrastructure/file-storage/FileStorageService';

// Application use cases
import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { UploadFileUseCase } from '../../application/use-cases/UploadFileUseCase';

// Application ports
import { IFileStorageService } from '../../application/ports/IFileStorageService';

/**
 * Configure dependency injection container
 * Registers all services and their implementations
 */
export function configureContainer(): void {
  // Register infrastructure services
  container.register<IUserRepository>('UserRepository', UserRepository);
  container.register<IFileRepository>('FileRepository', FileRepository);
  container.register<IFileStorageService>('FileStorageService', FileStorageService);

  // Register use cases with factory functions to inject dependencies
  container.registerFactory<CreateUserUseCase>('CreateUserUseCase', () => {
    const userRepository = container.resolve<IUserRepository>('UserRepository');
    return new CreateUserUseCase(userRepository);
  });

  container.registerFactory<UploadFileUseCase>('UploadFileUseCase', () => {
    const fileRepository = container.resolve<IFileRepository>('FileRepository');
    const fileStorageService = container.resolve<IFileStorageService>('FileStorageService');
    return new UploadFileUseCase(fileRepository, fileStorageService);
  });

  console.log('Dependency injection container configured successfully');
}

/**
 * Get container instance
 */
export { container };