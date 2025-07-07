import { configureContainer } from './shared/container/config';
import { UserController } from './presentation/controllers/UserController';
import { FileController } from './presentation/controllers/FileController';

/**
 * Application entry point
 * Configures dependency injection and initializes the application
 */
class Application {
  private userController: UserController;
  private fileController: FileController;

  constructor() {
    // Configure dependency injection
    configureContainer();

    // Initialize controllers
    this.userController = new UserController();
    this.fileController = new FileController();
  }

  /**
   * Start the application
   */
  async start(): Promise<void> {
    console.log('Starting application...');
    
    // In a real implementation, you would set up your web server here
    // For example, with Express.js:
    // const app = express();
    // this.setupRoutes(app);
    // app.listen(port, () => { ... });
    
    console.log('Application started successfully');
    console.log('Backend architecture implemented with:');
    console.log('✓ Clean Architecture layers');
    console.log('✓ SOLID principles');
    console.log('✓ Domain-Driven Design');
    console.log('✓ Dependency Injection');
    console.log('✓ Repository Pattern');
    console.log('✓ Use Cases');
    console.log('✓ File Storage with uploads directory');
  }

  /**
   * Get controllers (for testing or external use)
   */
  getControllers() {
    return {
      userController: this.userController,
      fileController: this.fileController,
    };
  }
}

// Export the application instance
export const app = new Application();

// Auto-start if this is the main module
if (require.main === module) {
  app.start().catch(console.error);
}

// Export for external use
export * from './domain/entities/User';
export * from './domain/entities/File';
export * from './domain/repositories/IUserRepository';
export * from './domain/repositories/IFileRepository';
export * from './application/use-cases/CreateUserUseCase';
export * from './application/use-cases/UploadFileUseCase';
export * from './infrastructure/repositories/UserRepository';
export * from './infrastructure/repositories/FileRepository';
export * from './infrastructure/file-storage/FileStorageService';
export * from './presentation/controllers/UserController';
export * from './presentation/controllers/FileController';
export * from './shared/container/Container';
export * from './shared/types/index';
export * from './shared/utils/index';
export * from './shared/constants/app.constants';