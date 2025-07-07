/**
 * File controller
 * Handles HTTP requests related to file operations
 */
export declare class FileController {
    private uploadFileUseCase;
    constructor();
    /**
     * Upload file
     * @param req Request object with file data
     * @param res Response object
     */
    uploadFile(req: any, res: any): Promise<void>;
    /**
     * Get file by ID
     * @param req Request object with file ID
     * @param res Response object
     */
    getFileById(req: any, res: any): Promise<void>;
    /**
     * Download file
     * @param req Request object with file ID
     * @param res Response object
     */
    downloadFile(req: any, res: any): Promise<void>;
    /**
     * Get user files
     * @param req Request object with user ID
     * @param res Response object
     */
    getUserFiles(req: any, res: any): Promise<void>;
}
//# sourceMappingURL=FileController.d.ts.map