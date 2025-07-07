import { APP_CONSTANTS } from '../constants/app.constants';

/**
 * Validation utilities
 */
export class ValidationUtils {
  /**
   * Validate email format
   * @param email Email to validate
   * @returns True if valid, false otherwise
   */
  static isValidEmail(email: string): boolean {
    return APP_CONSTANTS.EMAIL_REGEX.test(email);
  }

  /**
   * Validate name
   * @param name Name to validate
   * @returns True if valid, false otherwise
   */
  static isValidName(name: string): boolean {
    if (!name || typeof name !== 'string') {
      return false;
    }
    
    const trimmedName = name.trim();
    return trimmedName.length >= APP_CONSTANTS.MIN_NAME_LENGTH && 
           trimmedName.length <= APP_CONSTANTS.MAX_NAME_LENGTH;
  }

  /**
   * Validate file size
   * @param size File size in bytes
   * @returns True if valid, false otherwise
   */
  static isValidFileSize(size: number): boolean {
    return size > 0 && size <= APP_CONSTANTS.MAX_FILE_SIZE;
  }

  /**
   * Validate file type
   * @param mimeType MIME type to validate
   * @returns True if valid, false otherwise
   */
  static isValidFileType(mimeType: string): boolean {
    return (APP_CONSTANTS.ALLOWED_FILE_TYPES as readonly string[]).includes(mimeType);
  }

  /**
   * Sanitize filename
   * @param filename Filename to sanitize
   * @returns Sanitized filename
   */
  static sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  }
}

/**
 * File utilities
 */
export class FileUtils {
  /**
   * Get file extension from filename
   * @param filename Filename
   * @returns File extension without dot
   */
  static getExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1]! : '';
  }

  /**
   * Generate unique filename
   * @param originalName Original filename
   * @param prefix Optional prefix
   * @returns Unique filename
   */
  static generateUniqueFilename(originalName: string, prefix?: string): string {
    const extension = this.getExtension(originalName);
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 15);
    const baseFilename = `${prefix || 'file'}_${timestamp}_${random}`;
    
    return extension ? `${baseFilename}.${extension}` : baseFilename;
  }

  /**
   * Format file size for display
   * @param bytes File size in bytes
   * @returns Formatted size string
   */
  static formatFileSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  }
}

/**
 * String utilities
 */
export class StringUtils {
  /**
   * Generate random string
   * @param length String length
   * @returns Random string
   */
  static generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

  /**
   * Generate UUID v4
   * @returns UUID v4 string
   */
  static generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Truncate string
   * @param str String to truncate
   * @param length Maximum length
   * @returns Truncated string
   */
  static truncate(str: string, length: number): string {
    return str.length > length ? str.substring(0, length) + '...' : str;
  }
}