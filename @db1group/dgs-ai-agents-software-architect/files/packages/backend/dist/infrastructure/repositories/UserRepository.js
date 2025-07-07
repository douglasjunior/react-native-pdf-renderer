"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
/**
 * User repository implementation
 * Implements data access methods for User entities
 */
class UserRepository {
    constructor() {
        // In a real implementation, this would be a database connection
        this.users = new Map();
    }
    /**
     * Find user by ID
     */
    async findById(id) {
        return this.users.get(id) || null;
    }
    /**
     * Find all users
     */
    async findAll() {
        return Array.from(this.users.values());
    }
    /**
     * Save user (create or update)
     */
    async save(user) {
        this.users.set(user.id, user);
        return user;
    }
    /**
     * Delete user by ID
     */
    async delete(id) {
        this.users.delete(id);
    }
    /**
     * Check if user exists
     */
    async exists(id) {
        return this.users.has(id);
    }
    /**
     * Find user by email
     */
    async findByEmail(email) {
        const users = Array.from(this.users.values());
        return users.find(user => user.email === email.toLowerCase()) || null;
    }
    /**
     * Find all active users
     */
    async findAllActive() {
        const users = Array.from(this.users.values());
        return users.filter(user => user.isActive);
    }
    /**
     * Find users by name pattern
     */
    async findByNamePattern(namePattern) {
        const users = Array.from(this.users.values());
        const pattern = namePattern.toLowerCase();
        return users.filter(user => user.name.toLowerCase().includes(pattern));
    }
    /**
     * Check if email exists
     */
    async emailExists(email) {
        const user = await this.findByEmail(email);
        return user !== null;
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=UserRepository.js.map