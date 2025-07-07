import { Entity } from './Entity';
/**
 * User domain entity
 * Represents a user in the system with business logic
 */
export declare class User extends Entity<string> {
    private _name;
    private _email;
    private _isActive;
    constructor(id: string, name: string, email: string);
    /**
     * Get user name
     */
    get name(): string;
    /**
     * Get user email
     */
    get email(): string;
    /**
     * Check if user is active
     */
    get isActive(): boolean;
    /**
     * Update user name
     * @param name New name
     */
    updateName(name: string): void;
    /**
     * Update user email
     * @param email New email
     */
    updateEmail(email: string): void;
    /**
     * Activate user account
     */
    activate(): void;
    /**
     * Deactivate user account
     */
    deactivate(): void;
    /**
     * Validate email format
     */
    private isValidEmail;
    /**
     * Convert to plain object for serialization
     */
    toPlainObject(): any;
}
//# sourceMappingURL=User.d.ts.map