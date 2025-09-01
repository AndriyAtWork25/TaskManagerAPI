// utils/ApiError.js

/**
 *class ApiError - custom error class for API errors
 * @extends Error
 * @param {number} statusCode - HTTP status code
 * @param {string} message - Error message
 * @param {Array} errors - Optional array of detailed error messages
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

