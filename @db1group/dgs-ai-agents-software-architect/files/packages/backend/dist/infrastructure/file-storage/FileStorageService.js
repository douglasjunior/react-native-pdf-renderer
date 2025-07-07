"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStorageService = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
/**
 * File storage service implementation
 * Handles file system operations with upload directory management
 */
class FileStorageService {
    constructor() {
        // File paths are relative to the 'uploads' directory
        this.uploadsPath = path.join(process.cwd(), 'uploads');
        this.ensureUploadsDirectory();
    }
    /**
     * Ensure uploads directory exists
     */
    async ensureUploadsDirectory() {
        try {
            await fs.access(this.uploadsPath);
        }
        catch {
            await fs.mkdir(this.uploadsPath, { recursive: true });
        }
    }
    /**
     * Save file to storage
     */
    async save(file, filename, subfolder) {
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
    async read(filename, subfolder) {
        const filePath = this.getFullPath(filename, subfolder);
        try {
            return await fs.readFile(filePath);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${filename}`);
            }
            throw error;
        }
    }
    /**
     * Delete file from storage
     */
    async delete(filename, subfolder) {
        const filePath = this.getFullPath(filename, subfolder);
        try {
            await fs.unlink(filePath);
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${filename}`);
            }
            throw error;
        }
    }
    /**
     * Check if file exists
     */
    async exists(filename, subfolder) {
        const filePath = this.getFullPath(filename, subfolder);
        try {
            await fs.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Get file stats
     */
    async getStats(filename, subfolder) {
        const filePath = this.getFullPath(filename, subfolder);
        try {
            const stats = await fs.stat(filePath);
            return {
                size: stats.size,
                createdAt: stats.birthtime,
                modifiedAt: stats.mtime,
            };
        }
        catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`File not found: ${filename}`);
            }
            throw error;
        }
    }
    /**
     * Get full file path
     */
    getFullPath(filename, subfolder) {
        if (subfolder) {
            return path.join(this.uploadsPath, subfolder, filename);
        }
        return path.join(this.uploadsPath, filename);
    }
}
exports.FileStorageService = FileStorageService;
//# sourceMappingURL=FileStorageService.js.map