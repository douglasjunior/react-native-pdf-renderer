/**
 * Common type definitions
 */

/**
 * Generic result type for operations
 */
export type Result<T, E = Error> = {
  success: true;
  data: T;
} | {
  success: false;
  error: E;
};

/**
 * API response type
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * File upload data
 */
export interface FileUploadData {
  file: Buffer;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
}

/**
 * User creation data
 */
export interface UserCreationData {
  name: string;
  email: string;
}

/**
 * User update data
 */
export interface UserUpdateData {
  name?: string;
  email?: string;
}

/**
 * File metadata
 */
export interface FileMetadata {
  id: string;
  originalName: string;
  filename: string;
  mimeType: string;
  size: number;
  path: string;
  uploadedBy: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User data
 */
export interface UserData {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Environment configuration
 */
export interface AppConfig {
  port: number;
  nodeEnv: string;
  uploadsDir: string;
  maxFileSize: number;
  allowedFileTypes: string[];
}

/**
 * Database configuration
 */
export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

/**
 * Error types
 */
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  DUPLICATE_ERROR = 'DUPLICATE_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  UNAUTHORIZED_ERROR = 'UNAUTHORIZED_ERROR',
  FORBIDDEN_ERROR = 'FORBIDDEN_ERROR',
}

/**
 * Custom error class
 */
export class AppError extends Error {
  public readonly type: ErrorType;
  public readonly statusCode: number;

  constructor(message: string, type: ErrorType, statusCode: number = 500) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.name = 'AppError';
  }
}