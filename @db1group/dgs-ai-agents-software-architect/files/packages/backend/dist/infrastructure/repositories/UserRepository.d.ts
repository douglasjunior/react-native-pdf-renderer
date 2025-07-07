import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
/**
 * User repository implementation
 * Implements data access methods for User entities
 */
export declare class UserRepository implements IUserRepository {
    private users;
    /**
     * Find user by ID
     */
    findById(id: string): Promise<User | null>;
    /**
     * Find all users
     */
    findAll(): Promise<User[]>;
    /**
     * Save user (create or update)
     */
    save(user: User): Promise<User>;
    /**
     * Delete user by ID
     */
    delete(id: string): Promise<void>;
    /**
     * Check if user exists
     */
    exists(id: string): Promise<boolean>;
    /**
     * Find user by email
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Find all active users
     */
    findAllActive(): Promise<User[]>;
    /**
     * Find users by name pattern
     */
    findByNamePattern(namePattern: string): Promise<User[]>;
    /**
     * Check if email exists
     */
    emailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=UserRepository.d.ts.map