import { IRepository } from './IRepository';
import { User } from '../entities/User';
/**
 * User repository interface
 * Defines data access methods for User entities
 */
export interface IUserRepository extends IRepository<User, string> {
    /**
     * Find user by email
     * @param email User email
     * @returns Promise resolving to user or null if not found
     */
    findByEmail(email: string): Promise<User | null>;
    /**
     * Find all active users
     * @returns Promise resolving to array of active users
     */
    findAllActive(): Promise<User[]>;
    /**
     * Find users by name pattern
     * @param namePattern Name pattern to search for
     * @returns Promise resolving to array of matching users
     */
    findByNamePattern(namePattern: string): Promise<User[]>;
    /**
     * Check if email exists
     * @param email Email to check
     * @returns Promise resolving to boolean
     */
    emailExists(email: string): Promise<boolean>;
}
//# sourceMappingURL=IUserRepository.d.ts.map