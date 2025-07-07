"use strict";
/**
 * Common type definitions
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = exports.ErrorType = void 0;
/**
 * Error types
 */
var ErrorType;
(function (ErrorType) {
    ErrorType["VALIDATION_ERROR"] = "VALIDATION_ERROR";
    ErrorType["NOT_FOUND_ERROR"] = "NOT_FOUND_ERROR";
    ErrorType["DUPLICATE_ERROR"] = "DUPLICATE_ERROR";
    ErrorType["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorType["UNAUTHORIZED_ERROR"] = "UNAUTHORIZED_ERROR";
    ErrorType["FORBIDDEN_ERROR"] = "FORBIDDEN_ERROR";
})(ErrorType || (exports.ErrorType = ErrorType = {}));
/**
 * Custom error class
 */
class AppError extends Error {
    constructor(message, type, statusCode = 500) {
        super(message);
        this.type = type;
        this.statusCode = statusCode;
        this.name = 'AppError';
    }
}
exports.AppError = AppError;
//# sourceMappingURL=index.js.map