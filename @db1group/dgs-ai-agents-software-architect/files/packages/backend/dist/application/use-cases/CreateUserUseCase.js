"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUseCase = void 0;
const User_1 = require("../../domain/entities/User");
/**
 * Create user use case
 * Handles user creation with business logic validation
 */
class CreateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    /**
     * Execute use case
     * @param data User creation data
     * @returns Promise resolving to created user
     */
    async execute(data) {
        // Validate input
        if (!data.name || data.name.trim().length === 0) {
            throw new Error('Name is required');
        }
        if (!data.email || !this.isValidEmail(data.email)) {
            throw new Error('Valid email is required');
        }
        // Check if user already exists
        const existingUser = await this.userRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }
        // Create user
        const user = new User_1.User(data.id, data.name, data.email);
        // Save user
        return await this.userRepository.save(user);
    }
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
exports.CreateUserUseCase = CreateUserUseCase;
//# sourceMappingURL=CreateUserUseCase.js.map