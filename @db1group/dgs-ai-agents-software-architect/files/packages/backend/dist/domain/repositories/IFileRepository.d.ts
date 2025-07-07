import { IRepository } from './IRepository';
import { File } from '../entities/File';
/**
 * File repository interface
 * Defines data access methods for File entities
 */
export interface IFileRepository extends IRepository<File, string> {
    /**
     * Find files by user ID
     * @param userId User identifier
     * @returns Promise resolving to array of files
     */
    findByUserId(userId: string): Promise<File[]>;
    /**
     * Find files by MIME type
     * @param mimeType MIME type to filter by
     * @returns Promise resolving to array of files
     */
    findByMimeType(mimeType: string): Promise<File[]>;
    /**
     * Find files by filename pattern
     * @param pattern Filename pattern to search for
     * @returns Promise resolving to array of matching files
     */
    findByFilenamePattern(pattern: string): Promise<File[]>;
    /**
     * Get total storage size for a user
     * @param userId User identifier
     * @returns Promise resolving to total size in bytes
     */
    getTotalSizeByUserId(userId: string): Promise<number>;
    /**
     * Find files larger than specified size
     * @param sizeInBytes Size threshold in bytes
     * @returns Promise resolving to array of files
     */
    findLargerThan(sizeInBytes: number): Promise<File[]>;
}
//# sourceMappingURL=IFileRepository.d.ts.map