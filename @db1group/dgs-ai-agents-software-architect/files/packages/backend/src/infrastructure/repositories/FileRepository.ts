import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { File } from '../../domain/entities/File';

/**
 * File repository implementation
 * Implements data access methods for File entities
 */
export class FileRepository implements IFileRepository {
  // In a real implementation, this would be a database connection
  private files: Map<string, File> = new Map();

  /**
   * Find file by ID
   */
  async findById(id: string): Promise<File | null> {
    return this.files.get(id) || null;
  }

  /**
   * Find all files
   */
  async findAll(): Promise<File[]> {
    return Array.from(this.files.values());
  }

  /**
   * Save file (create or update)
   */
  async save(file: File): Promise<File> {
    this.files.set(file.id, file);
    return file;
  }

  /**
   * Delete file by ID
   */
  async delete(id: string): Promise<void> {
    this.files.delete(id);
  }

  /**
   * Check if file exists
   */
  async exists(id: string): Promise<boolean> {
    return this.files.has(id);
  }

  /**
   * Find files by user ID
   */
  async findByUserId(userId: string): Promise<File[]> {
    const files = Array.from(this.files.values());
    return files.filter(file => file.uploadedBy === userId);
  }

  /**
   * Find files by MIME type
   */
  async findByMimeType(mimeType: string): Promise<File[]> {
    const files = Array.from(this.files.values());
    return files.filter(file => file.mimeType === mimeType);
  }

  /**
   * Find files by filename pattern
   */
  async findByFilenamePattern(pattern: string): Promise<File[]> {
    const files = Array.from(this.files.values());
    const lowerPattern = pattern.toLowerCase();
    return files.filter(file => 
      file.filename.toLowerCase().includes(lowerPattern) ||
      file.originalName.toLowerCase().includes(lowerPattern)
    );
  }

  /**
   * Get total storage size for a user
   */
  async getTotalSizeByUserId(userId: string): Promise<number> {
    const userFiles = await this.findByUserId(userId);
    return userFiles.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Find files larger than specified size
   */
  async findLargerThan(sizeInBytes: number): Promise<File[]> {
    const files = Array.from(this.files.values());
    return files.filter(file => file.size > sizeInBytes);
  }
}