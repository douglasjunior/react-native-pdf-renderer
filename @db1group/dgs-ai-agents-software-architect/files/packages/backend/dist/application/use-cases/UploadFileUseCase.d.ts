import { IFileRepository } from '../../domain/repositories/IFileRepository';
import { IFileStorageService } from '../ports/IFileStorageService';
import { File } from '../../domain/entities/File';
/**
 * Upload file use case
 * Handles file upload with validation and storage
 */
export declare class UploadFileUseCase {
    private fileRepository;
    private fileStorageService;
    constructor(fileRepository: IFileRepository, fileStorageService: IFileStorageService);
    /**
     * Execute use case
     * @param data File upload data
     * @returns Promise resolving to uploaded file entity
     */
    execute(data: {
        file: Buffer;
        originalName: string;
        mimeType: string;
        uploadedBy: string;
    }): Promise<File>;
    /**
     * Get file extension from filename
     */
    private getFileExtension;
}
//# sourceMappingURL=UploadFileUseCase.d.ts.map