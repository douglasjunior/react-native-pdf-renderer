import { CreateUserUseCase } from '../../application/use-cases/CreateUserUseCase';
import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { container } from '../../shared/container/Container';

/**
 * User controller
 * Handles HTTP requests related to user operations
 */
export class UserController {
  private createUserUseCase: CreateUserUseCase;

  constructor() {
    // Use dependency injection to get use case
    this.createUserUseCase = container.resolve<CreateUserUseCase>('CreateUserUseCase');
  }

  /**
   * Create new user
   * @param req Request object with user data
   * @param res Response object
   */
  async createUser(req: any, res: any): Promise<void> {
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
    } catch (error) {
      // Handle errors
      console.error('Error creating user:', error);
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get user by ID
   * @param req Request object with user ID
   * @param res Response object
   */
  async getUserById(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;

      // Get user repository from container
      const userRepository = container.resolve<IUserRepository>('UserRepository');
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
    } catch (error) {
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
  async getAllUsers(_req: any, res: any): Promise<void> {
    try {
      // Get user repository from container
      const userRepository = container.resolve<IUserRepository>('UserRepository');
      const users = await userRepository.findAll();

      // Return users data
      res.json({
        success: true,
        data: users.map((user: any) => user.toPlainObject()),
      });
    } catch (error) {
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
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
}