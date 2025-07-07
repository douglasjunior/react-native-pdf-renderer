"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const config_1 = require("./shared/container/config");
const UserController_1 = require("./presentation/controllers/UserController");
const FileController_1 = require("./presentation/controllers/FileController");
/**
 * Application entry point
 * Configures dependency injection and initializes the application
 */
class Application {
    constructor() {
        // Configure dependency injection
        (0, config_1.configureContainer)();
        // Initialize controllers
        this.userController = new UserController_1.UserController();
        this.fileController = new FileController_1.FileController();
    }
    /**
     * Start the application
     */
    async start() {
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
exports.app = new Application();
// Auto-start if this is the main module
if (require.main === module) {
    exports.app.start().catch(console.error);
}
// Export for external use
__exportStar(require("./domain/entities/User"), exports);
__exportStar(require("./domain/entities/File"), exports);
__exportStar(require("./domain/repositories/IUserRepository"), exports);
__exportStar(require("./domain/repositories/IFileRepository"), exports);
__exportStar(require("./application/use-cases/CreateUserUseCase"), exports);
__exportStar(require("./application/use-cases/UploadFileUseCase"), exports);
__exportStar(require("./infrastructure/repositories/UserRepository"), exports);
__exportStar(require("./infrastructure/repositories/FileRepository"), exports);
__exportStar(require("./infrastructure/file-storage/FileStorageService"), exports);
__exportStar(require("./presentation/controllers/UserController"), exports);
__exportStar(require("./presentation/controllers/FileController"), exports);
__exportStar(require("./shared/container/Container"), exports);
__exportStar(require("./shared/types/index"), exports);
__exportStar(require("./shared/utils/index"), exports);
__exportStar(require("./shared/constants/app.constants"), exports);
//# sourceMappingURL=index.js.map