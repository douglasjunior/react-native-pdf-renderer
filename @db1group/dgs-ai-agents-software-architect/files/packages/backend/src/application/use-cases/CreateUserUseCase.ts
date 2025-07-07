import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';

/**
 * Create user use case
 * Handles user creation with business logic validation
 */
export class CreateUserUseCase {
  constructor(private userRepository: IUserRepository) {}

  /**
   * Execute use case
   * @param data User creation data
   * @returns Promise resolving to created user
   */
  async execute(data: {
    id: string;
    name: string;
    email: string;
  }): Promise<User> {
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
    const user = new User(data.id, data.name, data.email);

    // Save user
    return await this.userRepository.save(user);
  }

  /**
   * Validate email format
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}