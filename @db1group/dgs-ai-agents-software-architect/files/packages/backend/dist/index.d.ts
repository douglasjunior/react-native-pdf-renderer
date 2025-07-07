import { UserController } from './presentation/controllers/UserController';
import { FileController } from './presentation/controllers/FileController';
/**
 * Application entry point
 * Configures dependency injection and initializes the application
 */
declare class Application {
    private userController;
    private fileController;
    constructor();
    /**
     * Start the application
     */
    start(): Promise<void>;
    /**
     * Get controllers (for testing or external use)
     */
    getControllers(): {
        userController: UserController;
        fileController: FileController;
    };
}
export declare const app: Application;
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
//# sourceMappingURL=index.d.ts.map