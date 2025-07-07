"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const Container_1 = require("../../shared/container/Container");
/**
 * User controller
 * Handles HTTP requests related to user operations
 */
class UserController {
    constructor() {
        // Use dependency injection to get use case
        this.createUserUseCase = Container_1.container.resolve('CreateUserUseCase');
    }
    /**
     * Create new user
     * @param req Request object with user data
     * @param res Response object
     */
    async createUser(req, res) {
        try {
            const { name, email } = req.body;
            // Generate user ID (in real app, this might come from authentication)
            const id = this.generateUserId();
            // Execute use case
            const user = await this.createUserUseCase.execute({
                id,
                name,
                email,
            });
            // Return success response
            res.status(201).json({
                success: true,
                data: user.toPlainObject(),
                message: 'User created successfully',
            });
        }
        catch (error) {
            // Handle errors
            console.error('Error creating user:', error);
            res.status(400).json({
                success: false,
                error: error.message,
            });
        }
    }
    /**
     * Get user by ID
     * @param req Request object with user ID
     * @param res Response object
     */
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            // Get user repository from container
            const userRepository = Container_1.container.resolve('UserRepository');
            const user = await userRepository.findById(id);
            if (!user) {
                res.status(404).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }
            // Return user data
            res.json({
                success: true,
                data: user.toPlainObject(),
            });
        }
        catch (error) {
            console.error('Error getting user:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Get all users
     * @param req Request object
     * @param res Response object
     */
    async getAllUsers(_req, res) {
        try {
            // Get user repository from container
            const userRepository = Container_1.container.resolve('UserRepository');
            const users = await userRepository.findAll();
            // Return users data
            res.json({
                success: true,
                data: users.map((user) => user.toPlainObject()),
            });
        }
        catch (error) {
            console.error('Error getting users:', error);
            res.status(500).json({
                success: false,
                error: 'Internal server error',
            });
        }
    }
    /**
     * Generate user ID
     */
    generateUserId() {
        return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map