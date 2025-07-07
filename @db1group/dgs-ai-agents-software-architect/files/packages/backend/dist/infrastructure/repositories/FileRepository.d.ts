import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { File } from '../../domain/entities/File';
/**
 * File repository implementation
 * Implements data access methods for File entities
 */
export declare class FileRepository implements IFileRepository {
    private files;
    /**
     * Find file by ID
     */
    findById(id: string): Promise<File | null>;
    /**
     * Find all files
     */
    findAll(): Promise<File[]>;
    /**
     * Save file (create or update)
     */
    save(file: File): Promise<File>;
    /**
     * Delete file by ID
     */
    delete(id: string): Promise<void>;
    /**
     * Check if file exists
     */
    exists(id: string): Promise<boolean>;
    /**
     * Find files by user ID
     */
    findByUserId(userId: string): Promise<File[]>;
    /**
     * Find files by MIME type
     */
    findByMimeType(mimeType: string): Promise<File[]>;
    /**
     * Find files by filename pattern
     */
    findByFilenamePattern(pattern: string): Promise<File[]>;
    /**
     * Get total storage size for a user
     */
    getTotalSizeByUserId(userId: string): Promise<number>;
    /**
     * Find files larger than specified size
     */
    findLargerThan(sizeInBytes: number): Promise<File[]>;
}
//# sourceMappingURL=FileRepository.d.ts.map