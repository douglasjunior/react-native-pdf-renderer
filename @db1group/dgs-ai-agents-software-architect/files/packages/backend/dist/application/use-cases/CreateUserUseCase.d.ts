import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
/**
 * Create user use case
 * Handles user creation with business logic validation
 */
export declare class CreateUserUseCase {
    private userRepository;
    constructor(userRepository: IUserRepository);
    /**
     * Execute use case
     * @param data User creation data
     * @returns Promise resolving to created user
     */
    execute(data: {
        id: string;
        name: string;
        email: string;
    }): Promise<User>;
    /**
     * Validate email format
     */
    private isValidEmail;
}
//# sourceMappingURL=CreateUserUseCase.d.ts.map