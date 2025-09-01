// src/utils/ApiResponse.js

/**
 * class for standard API responses.
 * lways returns the same structure:
 * - success (true/false)
 * - message (text message)
 * - data (results, if any)
 * - errors (object with detailed errors, if any)
 */
export class ApiResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
