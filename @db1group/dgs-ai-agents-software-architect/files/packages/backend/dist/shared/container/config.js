"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.container = void 0;
exports.configureContainer = configureContainer;
const Container_1 = require("./Container");
Object.defineProperty(exports, "container", { enumerable: true, get: function () { return Container_1.container; } });
// Infrastructure implementations
const UserRepository_1 = require("../../infrastructure/repositories/UserRepository");
const FileRepository_1 = require("../../infrastructure/repositories/FileRepository");
const FileStorageService_1 = require("../../infrastructure/file-storage/FileStorageService");
// Application use cases
const CreateUserUseCase_1 = require("../../application/use-cases/CreateUserUseCase");
const UploadFileUseCase_1 = require("../../application/use-cases/UploadFileUseCase");
/**
 * Configure dependency injection container
 * Registers all services and their implementations
 */
function configureContainer() {
    // Register infrastructure services
    Container_1.container.register('UserRepository', UserRepository_1.UserRepository);
    Container_1.container.register('FileRepository', FileRepository_1.FileRepository);
    Container_1.container.register('FileStorageService', FileStorageService_1.FileStorageService);
    // Register use cases with factory functions to inject dependencies
    Container_1.container.registerFactory('CreateUserUseCase', () => {
        const userRepository = Container_1.container.resolve('UserRepository');
        return new CreateUserUseCase_1.CreateUserUseCase(userRepository);
    });
    Container_1.container.registerFactory('UploadFileUseCase', () => {
        const fileRepository = Container_1.container.resolve('FileRepository');
        const fileStorageService = Container_1.container.resolve('FileStorageService');
        return new UploadFileUseCase_1.UploadFileUseCase(fileRepository, fileStorageService);
    });
    console.log('Dependency injection container configured successfully');
}
//# sourceMappingURL=config.js.map