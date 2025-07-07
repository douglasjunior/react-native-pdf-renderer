import { IFileStorageService } from '../../application/ports/IFileStorageService';
/**
 * File storage service implementation
 * Handles file system operations with upload directory management
 */
export declare class FileStorageService implements IFileStorageService {
    private readonly uploadsPath;
    constructor();
    /**
     * Ensure uploads directory exists
     */
    private ensureUploadsDirectory;
    /**
     * Save file to storage
     */
    save(file: Buffer, filename: string, subfolder?: string): Promise<string>;
    /**
     * Read file from storage
     */
    read(filename: string, subfolder?: string): Promise<Buffer>;
    /**
     * Delete file from storage
     */
    delete(filename: string, subfolder?: string): Promise<void>;
    /**
     * Check if file exists
     */
    exists(filename: string, subfolder?: string): Promise<boolean>;
    /**
     * Get file stats
     */
    getStats(filename: string, subfolder?: string): Promise<{
        size: number;
        createdAt: Date;
        modifiedAt: Date;
    }>;
    /**
     * Get full file path
     */
    getFullPath(filename: string, subfolder?: string): string;
}
//# sourceMappingURL=FileStorageService.d.ts.map