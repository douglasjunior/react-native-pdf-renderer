"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.File = void 0;
const Entity_1 = require("./Entity");
/**
 * File domain entity
 * Represents a file in the system with metadata
 */
class File extends Entity_1.Entity {
    constructor(id, originalName, filename, mimeType, size, path, uploadedBy) {
        super(id);
        this._originalName = originalName;
        this._filename = filename;
        this._mimeType = mimeType;
        this._size = size;
        this._path = path;
        this._uploadedBy = uploadedBy;
    }
    /**
     * Get original file name
     */
    get originalName() {
        return this._originalName;
    }
    /**
     * Get stored filename
     */
    get filename() {
        return this._filename;
    }
    /**
     * Get MIME type
     */
    get mimeType() {
        return this._mimeType;
    }
    /**
     * Get file size in bytes
     */
    get size() {
        return this._size;
    }
    /**
     * Get file path
     */
    get path() {
        return this._path;
    }
    /**
     * Get user who uploaded the file
     */
    get uploadedBy() {
        return this._uploadedBy;
    }
    /**
     * Check if file is an image
     */
    isImage() {
        return this._mimeType.startsWith('image/');
    }
    /**
     * Check if file is a document
     */
    isDocument() {
        const documentTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain',
        ];
        return documentTypes.includes(this._mimeType);
    }
    /**
     * Get file extension
     */
    getExtension() {
        const parts = this._filename.split('.');
        return parts.length > 1 ? parts[parts.length - 1] : '';
    }
    /**
     * Convert to plain object for serialization
     */
    toPlainObject() {
        return {
            id: this._id,
            originalName: this._originalName,
            filename: this._filename,
            mimeType: this._mimeType,
            size: this._size,
            path: this._path,
            uploadedBy: this._uploadedBy,
            createdAt: this._createdAt,
            updatedAt: this._updatedAt,
        };
    }
}
exports.File = File;
//# sourceMappingURL=File.js.map