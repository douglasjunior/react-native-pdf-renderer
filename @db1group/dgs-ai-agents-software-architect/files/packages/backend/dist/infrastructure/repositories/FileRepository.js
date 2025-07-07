"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = void 0;
/**
 * File repository implementation
 * Implements data access methods for File entities
 */
class FileRepository {
    constructor() {
        // In a real implementation, this would be a database connection
        this.files = new Map();
    }
    /**
     * Find file by ID
     */
    async findById(id) {
        return this.files.get(id) || null;
    }
    /**
     * Find all files
     */
    async findAll() {
        return Array.from(this.files.values());
    }
    /**
     * Save file (create or update)
     */
    async save(file) {
        this.files.set(file.id, file);
        return file;
    }
    /**
     * Delete file by ID
     */
    async delete(id) {
        this.files.delete(id);
    }
    /**
     * Check if file exists
     */
    async exists(id) {
        return this.files.has(id);
    }
    /**
     * Find files by user ID
     */
    async findByUserId(userId) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.uploadedBy === userId);
    }
    /**
     * Find files by MIME type
     */
    async findByMimeType(mimeType) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.mimeType === mimeType);
    }
    /**
     * Find files by filename pattern
     */
    async findByFilenamePattern(pattern) {
        const files = Array.from(this.files.values());
        const lowerPattern = pattern.toLowerCase();
        return files.filter(file => file.filename.toLowerCase().includes(lowerPattern) ||
            file.originalName.toLowerCase().includes(lowerPattern));
    }
    /**
     * Get total storage size for a user
     */
    async getTotalSizeByUserId(userId) {
        const userFiles = await this.findByUserId(userId);
        return userFiles.reduce((total, file) => total + file.size, 0);
    }
    /**
     * Find files larger than specified size
     */
    async findLargerThan(sizeInBytes) {
        const files = Array.from(this.files.values());
        return files.filter(file => file.size > sizeInBytes);
    }
}
exports.FileRepository = FileRepository;
//# sourceMappingURL=FileRepository.js.map