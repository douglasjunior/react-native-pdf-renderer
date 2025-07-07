import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { IFileStorageService } from '../ports/IFileStorageService';
import { File } from '../../domain/entities/File';
import { StringUtils } from '../../shared/utils/index';

/**
 * Upload file use case
 * Handles file upload with validation and storage
 */
export class UploadFileUseCase {
  constructor(
    private fileRepository: IFileRepository,
    private fileStorageService: IFileStorageService
  ) {}

  /**
   * Execute use case
   * @param data File upload data
   * @returns Promise resolving to uploaded file entity
   */
  async execute(data: {
    file: Buffer;
    originalName: string;
    mimeType: string;
    uploadedBy: string;
  }): Promise<File> {
    // Validate input
    if (!data.file || data.file.length === 0) {
      throw new Error('File is required');
    }

    if (!data.originalName || data.originalName.trim().length === 0) {
      throw new Error('Original filename is required');
    }

    if (!data.mimeType) {
      throw new Error('MIME type is required');
    }

    if (!data.uploadedBy) {
      throw new Error('User ID is required');
    }

    // Generate unique filename
    const fileId = StringUtils.generateUUID();
    const extension = this.getFileExtension(data.originalName);
    const filename = `${fileId}${extension ? '.' + extension : ''}`;

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (data.file.length > maxSize) {
      throw new Error('File size exceeds maximum limit of 10MB');
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(data.mimeType)) {
      throw new Error('File type not allowed');
    }

    // Save file to storage
    const relativePath = await this.fileStorageService.save(
      data.file,
      filename,
      'user-uploads'
    );

    // Create file entity
    const file = new File(
      fileId,
      data.originalName,
      filename,
      data.mimeType,
      data.file.length,
      relativePath,
      data.uploadedBy
    );

    // Save file metadata
    return await this.fileRepository.save(file);
  }

  /**
   * Get file extension from filename
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1]! : '';
  }
}