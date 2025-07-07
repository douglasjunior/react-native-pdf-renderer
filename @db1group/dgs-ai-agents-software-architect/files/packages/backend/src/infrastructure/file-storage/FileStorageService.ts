import * as fs from 'fs/promises';
import * as path from 'path';
import { IFileStorageService } from '../../application/ports/IFileStorageService';

/**
 * File storage service implementation
 * Handles file system operations with upload directory management
 */
export class FileStorageService implements IFileStorageService {
  private readonly uploadsPath: string;

  constructor() {
    // File paths are relative to the 'uploads' directory
    this.uploadsPath = path.join(process.cwd(), 'uploads');
    this.ensureUploadsDirectory();
  }

  /**
   * Ensure uploads directory exists
   */
  private async ensureUploadsDirectory(): Promise<void> {
    try {
      await fs.access(this.uploadsPath);
    } catch {
      await fs.mkdir(this.uploadsPath, { recursive: true });
    }
  }

  /**
   * Save file to storage
   */
  async save(file: Buffer, filename: string, subfolder?: string): Promise<string> {
    const filePath = this.getFullPath(filename, subfolder);
    const directory = path.dirname(filePath);
    
    // Ensure directory exists
    await fs.mkdir(directory, { recursive: true });
    
    // Write file
    await fs.writeFile(filePath, file);
    
    // Return relative path from uploads directory
    return path.relative(this.uploadsPath, filePath);
  }

  /**
   * Read file from storage
   */
  async read(filename: string, subfolder?: string): Promise<Buffer> {
    const filePath = this.getFullPath(filename, subfolder);
    
    try {
      return await fs.readFile(filePath);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Delete file from storage
   */
  async delete(filename: string, subfolder?: string): Promise<void> {
    const filePath = this.getFullPath(filename, subfolder);
    
    try {
      await fs.unlink(filePath);
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Check if file exists
   */
  async exists(filename: string, subfolder?: string): Promise<boolean> {
    const filePath = this.getFullPath(filename, subfolder);
    
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file stats
   */
  async getStats(filename: string, subfolder?: string): Promise<{
    size: number;
    createdAt: Date;
    modifiedAt: Date;
  }> {
    const filePath = this.getFullPath(filename, subfolder);
    
    try {
      const stats = await fs.stat(filePath);
      return {
        size: stats.size,
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
      };
    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        throw new Error(`File not found: ${filename}`);
      }
      throw error;
    }
  }

  /**
   * Get full file path
   */
  getFullPath(filename: string, subfolder?: string): string {
    if (subfolder) {
      return path.join(this.uploadsPath, subfolder, filename);
    }
    return path.join(this.uploadsPath, filename);
  }
}