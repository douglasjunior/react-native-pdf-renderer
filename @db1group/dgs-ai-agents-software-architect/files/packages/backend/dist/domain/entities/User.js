"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const Entity_1 = require("./Entity");
/**
 * User domain entity
 * Represents a user in the system with business logic
 */
class User extends Entity_1.Entity {
    constructor(id, name, email) {
        super(id);
        this._name = name;
        this._email = email;
        this._isActive = true;
    }
    /**
     * Get user name
     */
    get name() {
        return this._name;
    }
    /**
     * Get user email
     */
    get email() {
        return this._email;
    }
    /**
     * Check if user is active
     */
    get isActive() {
        return this._isActive;
    }
    /**
     * Update user name
     * @param name New name
     */
    updateName(name) {
        if (!name || name.trim().length === 0) {
            throw new Error('Name cannot be empty');
        }
        this._name = name.trim();
        this.touch();
    }
    /**
     * Update user email
     * @param email New email
     */
    updateEmail(email) {
        if (!this.isValidEmail(email)) {
            throw new Error('Invalid email format');
        }
        this._email = email.toLowerCase();
        this.touch();
    }
    /**
     * Activate user account
     */
    activate() {
        this._isActive = true;
        this.touch();
    }
    /**
     * Deactivate user account
     */
    deactivate() {
        this._isActive = false;
        this.touch();
    }
    /**
     * Validate email format
     */
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    /**
     * Convert to plain object for serialization
     */
    toPlainObject() {
        return {
            id: this._id,
            name: this._name,
            email: this._email,
            isActive: this._isActive,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.User = User;
//# sourceMappingURL=User.js.map