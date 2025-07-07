import { Entity } from './Entity';

/**
 * File domain entity
 * Represents a file in the system with metadata
 */
export class File extends Entity<string> {
  private _originalName: string;
  private _filename: string;
  private _mimeType: string;
  private _size: number;
  private _path: string;
  private _uploadedBy: string;

  constructor(
    id: string,
    originalName: string,
    filename: string,
    mimeType: string,
    size: number,
    path: string,
    uploadedBy: string
  ) {
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
  get originalName(): string {
    return this._originalName;
  }

  /**
   * Get stored filename
   */
  get filename(): string {
    return this._filename;
  }

  /**
   * Get MIME type
   */
  get mimeType(): string {
    return this._mimeType;
  }

  /**
   * Get file size in bytes
   */
  get size(): number {
    return this._size;
  }

  /**
   * Get file path
   */
  get path(): string {
    return this._path;
  }

  /**
   * Get user who uploaded the file
   */
  get uploadedBy(): string {
    return this._uploadedBy;
  }

  /**
   * Check if file is an image
   */
  isImage(): boolean {
    return this._mimeType.startsWith('image/');
  }

  /**
   * Check if file is a document
   */
  isDocument(): boolean {
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
  getExtension(): string {
    const parts = this._filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1]! : '';
  }

  /**
   * Convert to plain object for serialization
   */
  toPlainObject(): any {
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