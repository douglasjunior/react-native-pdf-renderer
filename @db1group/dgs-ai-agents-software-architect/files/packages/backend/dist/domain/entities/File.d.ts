import { Entity } from './Entity';
/**
 * File domain entity
 * Represents a file in the system with metadata
 */
export declare class File extends Entity<string> {
    private _originalName;
    private _filename;
    private _mimeType;
    private _size;
    private _path;
    private _uploadedBy;
    constructor(id: string, originalName: string, filename: string, mimeType: string, size: number, path: string, uploadedBy: string);
    /**
     * Get original file name
     */
    get originalName(): string;
    /**
     * Get stored filename
     */
    get filename(): string;
    /**
     * Get MIME type
     */
    get mimeType(): string;
    /**
     * Get file size in bytes
     */
    get size(): number;
    /**
     * Get file path
     */
    get path(): string;
    /**
     * Get user who uploaded the file
     */
    get uploadedBy(): string;
    /**
     * Check if file is an image
     */
    isImage(): boolean;
    /**
     * Check if file is a document
     */
    isDocument(): boolean;
    /**
     * Get file extension
     */
    getExtension(): string;
    /**
     * Convert to plain object for serialization
     */
    toPlainObject(): any;
}
//# sourceMappingURL=File.d.ts.map