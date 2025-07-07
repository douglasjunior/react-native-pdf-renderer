/**
 * Application constants
 */
export const APP_CONSTANTS = {
  // File upload limits
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'text/plain',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ],

  // Directory paths
  UPLOADS_DIR: 'uploads',
  USER_UPLOADS_SUBDIR: 'user-uploads',
  TEMP_UPLOADS_SUBDIR: 'temp',

  // Validation
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  MIN_NAME_LENGTH: 2,
  MAX_NAME_LENGTH: 100,

  // Error messages
  ERROR_MESSAGES: {
    INVALID_EMAIL: 'Invalid email format',
    NAME_REQUIRED: 'Name is required',
    NAME_TOO_SHORT: 'Name must be at least 2 characters long',
    NAME_TOO_LONG: 'Name must not exceed 100 characters',
    FILE_REQUIRED: 'File is required',
    FILE_TOO_LARGE: 'File size exceeds maximum limit of 10MB',
    FILE_TYPE_NOT_ALLOWED: 'File type not allowed',
    USER_NOT_FOUND: 'User not found',
    FILE_NOT_FOUND: 'File not found',
    EMAIL_ALREADY_EXISTS: 'User with this email already exists',
    INTERNAL_ERROR: 'Internal server error',
  },

  // HTTP status codes
  HTTP_STATUS: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    INTERNAL_ERROR: 500,
  },
} as const;