/**
 * Validation utilities
 */
export declare class ValidationUtils {
    /**
     * Validate email format
     * @param email Email to validate
     * @returns True if valid, false otherwise
     */
    static isValidEmail(email: string): boolean;
    /**
     * Validate name
     * @param name Name to validate
     * @returns True if valid, false otherwise
     */
    static isValidName(name: string): boolean;
    /**
     * Validate file size
     * @param size File size in bytes
     * @returns True if valid, false otherwise
     */
    static isValidFileSize(size: number): boolean;
    /**
     * Validate file type
     * @param mimeType MIME type to validate
     * @returns True if valid, false otherwise
     */
    static isValidFileType(mimeType: string): boolean;
    /**
     * Sanitize filename
     * @param filename Filename to sanitize
     * @returns Sanitized filename
     */
    static sanitizeFilename(filename: string): string;
}
/**
 * File utilities
 */
export declare class FileUtils {
    /**
     * Get file extension from filename
     * @param filename Filename
     * @returns File extension without dot
     */
    static getExtension(filename: string): string;
    /**
     * Generate unique filename
     * @param originalName Original filename
     * @param prefix Optional prefix
     * @returns Unique filename
     */
    static generateUniqueFilename(originalName: string, prefix?: string): string;
    /**
     * Format file size for display
     * @param bytes File size in bytes
     * @returns Formatted size string
     */
    static formatFileSize(bytes: number): string;
}
/**
 * String utilities
 */
export declare class StringUtils {
    /**
     * Generate random string
     * @param length String length
     * @returns Random string
     */
    static generateRandomString(length: number): string;
    /**
     * Generate UUID v4
     * @returns UUID v4 string
     */
    static generateUUID(): string;
    /**
     * Truncate string
     * @param str String to truncate
     * @param length Maximum length
     * @returns Truncated string
     */
    static truncate(str: string, length: number): string;
}
//# sourceMappingURL=index.d.ts.map