import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

/**
 * User repository implementation
 * Implements data access methods for User entities
 */
export class UserRepository implements IUserRepository {
  // In a real implementation, this would be a database connection
  private users: Map<string, User> = new Map();

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  /**
   * Find all users
   */
  async findAll(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  /**
   * Save user (create or update)
   */
  async save(user: User): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  /**
   * Delete user by ID
   */
  async delete(id: string): Promise<void> {
    this.users.delete(id);
  }

  /**
   * Check if user exists
   */
  async exists(id: string): Promise<boolean> {
    return this.users.has(id);
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    const users = Array.from(this.users.values());
    return users.find(user => user.email === email.toLowerCase()) || null;
  }

  /**
   * Find all active users
   */
  async findAllActive(): Promise<User[]> {
    const users = Array.from(this.users.values());
    return users.filter(user => user.isActive);
  }

  /**
   * Find users by name pattern
   */
  async findByNamePattern(namePattern: string): Promise<User[]> {
    const users = Array.from(this.users.values());
    const pattern = namePattern.toLowerCase();
    return users.filter(user => 
      user.name.toLowerCase().includes(pattern)
    );
  }

  /**
   * Check if email exists
   */
  async emailExists(email: string): Promise<boolean> {
    const user = await this.findByEmail(email);
    return user !== null;
  }
}