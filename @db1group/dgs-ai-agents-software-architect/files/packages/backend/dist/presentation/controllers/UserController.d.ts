/**
 * User controller
 * Handles HTTP requests related to user operations
 */
export declare class UserController {
    private createUserUseCase;
    constructor();
    /**
     * Create new user
     * @param req Request object with user data
     * @param res Response object
     */
    createUser(req: any, res: any): Promise<void>;
    /**
     * Get user by ID
     * @param req Request object with user ID
     * @param res Response object
     */
    getUserById(req: any, res: any): Promise<void>;
    /**
     * Get all users
     * @param req Request object
     * @param res Response object
     */
    getAllUsers(_req: any, res: any): Promise<void>;
    /**
     * Generate user ID
     */
    private generateUserId;
}
//# sourceMappingURL=UserController.d.ts.map