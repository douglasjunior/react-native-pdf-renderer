/**
 * Application constants
 */
export declare const APP_CONSTANTS: {
    readonly MAX_FILE_SIZE: number;
    readonly ALLOWED_FILE_TYPES: readonly ["image/jpeg", "image/png", "image/gif", "application/pdf", "text/plain", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    readonly UPLOADS_DIR: "uploads";
    readonly USER_UPLOADS_SUBDIR: "user-uploads";
    readonly TEMP_UPLOADS_SUBDIR: "temp";
    readonly EMAIL_REGEX: RegExp;
    readonly MIN_NAME_LENGTH: 2;
    readonly MAX_NAME_LENGTH: 100;
    readonly ERROR_MESSAGES: {
        readonly INVALID_EMAIL: "Invalid email format";
        readonly NAME_REQUIRED: "Name is required";
        readonly NAME_TOO_SHORT: "Name must be at least 2 characters long";
        readonly NAME_TOO_LONG: "Name must not exceed 100 characters";
        readonly FILE_REQUIRED: "File is required";
        readonly FILE_TOO_LARGE: "File size exceeds maximum limit of 10MB";
        readonly FILE_TYPE_NOT_ALLOWED: "File type not allowed";
        readonly USER_NOT_FOUND: "User not found";
        readonly FILE_NOT_FOUND: "File not found";
        readonly EMAIL_ALREADY_EXISTS: "User with this email already exists";
        readonly INTERNAL_ERROR: "Internal server error";
    };
    readonly HTTP_STATUS: {
        readonly OK: 200;
        readonly CREATED: 201;
        readonly BAD_REQUEST: 400;
        readonly UNAUTHORIZED: 401;
        readonly FORBIDDEN: 403;
        readonly NOT_FOUND: 404;
        readonly CONFLICT: 409;
        readonly INTERNAL_ERROR: 500;
    };
};
//# sourceMappingURL=app.constants.d.ts.map