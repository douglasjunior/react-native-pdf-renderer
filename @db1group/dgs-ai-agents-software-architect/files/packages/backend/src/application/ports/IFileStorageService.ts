/**
 * File storage service interface
 * Defines methods for file system operations
 */
export interface IFileStorageService {
  /**
   * Save file to storage
   * @param file File buffer
   * @param filename Filename to save as
   * @param subfolder Optional subfolder within uploads directory
   * @returns Promise resolving to saved file path
   */
  save(file: Buffer, filename: string, subfolder?: string): Promise<string>;

  /**
   * Read file from storage
   * @param filename Filename to read
   * @param subfolder Optional subfolder within uploads directory
   * @returns Promise resolving to file buffer
   */
  read(filename: string, subfolder?: string): Promise<Buffer>;

  /**
   * Delete file from storage
   * @param filename Filename to delete
   * @param subfolder Optional subfolder within uploads directory
   * @returns Promise resolving to void
   */
  delete(filename: string, subfolder?: string): Promise<void>;

  /**
   * Check if file exists
   * @param filename Filename to check
   * @param subfolder Optional subfolder within uploads directory
   * @returns Promise resolving to boolean
   */
  exists(filename: string, subfolder?: string): Promise<boolean>;

  /**
   * Get file stats
   * @param filename Filename to get stats for
   * @param subfolder Optional subfolder within uploads directory
   * @returns Promise resolving to file stats
   */
  getStats(filename: string, subfolder?: string): Promise<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  }>;

  /**
   * Get full file path
   * @param filename Filename
   * @param subfolder Optional subfolder within uploads directory
   * @returns Full file path
   */
  getFullPath(filename: string, subfolder?: string): string;
}