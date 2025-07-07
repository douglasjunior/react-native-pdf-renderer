import { UploadFileUseCase } from '../../application/use-cases/UploadFileUseCase';
import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { IFileStorageService } from '../../application/ports/IFileStorageService';
import { container } from '../../shared/container/Container';

/**
 * File controller
 * Handles HTTP requests related to file operations
 */
export class FileController {
  private uploadFileUseCase: UploadFileUseCase;

  constructor() {
    // Use dependency injection to get use case
    this.uploadFileUseCase = container.resolve<UploadFileUseCase>('UploadFileUseCase');
  }

  /**
   * Upload file
   * @param req Request object with file data
   * @param res Response object
   */
  async uploadFile(req: any, res: any): Promise<void> {
    try {
      // In a real implementation, this would come from multipart form data
      const { file, originalName, mimeType, uploadedBy } = req.body;

      // Convert base64 to buffer if needed
      const fileBuffer = Buffer.isBuffer(file) ? file : Buffer.from(file, 'base64');

      // Execute use case
      const uploadedFile = await this.uploadFileUseCase.execute({
        file: fileBuffer,
        originalName,
        mimeType,
        uploadedBy,
      });

      // Return success response
      res.status(201).json({
        success: true,
        data: uploadedFile.toPlainObject(),
        message: 'File uploaded successfully',
      });
    } catch (error) {
      // Handle errors
      console.error('Error uploading file:', error);
      res.status(400).json({
        success: false,
        error: (error as Error).message,
      });
    }
  }

  /**
   * Get file by ID
   * @param req Request object with file ID
   * @param res Response object
   */
  async getFileById(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;

      // Get file repository from container
      const fileRepository = container.resolve<IFileRepository>('FileRepository');
      const file = await fileRepository.findById(id);

      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
        });
        return;
      }

      // Return file metadata
      res.json({
        success: true,
        data: file.toPlainObject(),
      });
    } catch (error) {
      console.error('Error getting file:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Download file
   * @param req Request object with file ID
   * @param res Response object
   */
  async downloadFile(req: any, res: any): Promise<void> {
    try {
      const { id } = req.params;

      // Get file repository and storage service from container
      const fileRepository = container.resolve<IFileRepository>('FileRepository');
      const fileStorageService = container.resolve<IFileStorageService>('FileStorageService');

      // Get file metadata
      const file = await fileRepository.findById(id);
      if (!file) {
        res.status(404).json({
          success: false,
          error: 'File not found',
        });
        return;
      }

      // Read file from storage
      const fileBuffer = await fileStorageService.read(file.filename, 'user-uploads');

      // Set appropriate headers
      res.set({
        'Content-Type': file.mimeType,
        'Content-Length': file.size.toString(),
        'Content-Disposition': `attachment; filename="${file.originalName}"`,
      });

      // Send file
      res.send(fileBuffer);
    } catch (error) {
      console.error('Error downloading file:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }

  /**
   * Get user files
   * @param req Request object with user ID
   * @param res Response object
   */
  async getUserFiles(req: any, res: any): Promise<void> {
    try {
      const { userId } = req.params;

      // Get file repository from container
      const fileRepository = container.resolve<IFileRepository>('FileRepository');
      const files = await fileRepository.findByUserId(userId);

      // Return files data
      res.json({
        success: true,
        data: files.map((file: any) => file.toPlainObject()),
      });
    } catch (error) {
      console.error('Error getting user files:', error);
      res.status(500).json({
        success: false,
        error: 'Internal server error',
      });
    }
  }
}