// src/middleware/errorHandler.js
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Centralized error processor
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .json(new ApiResponse(false, err.message, null, err.errors));
  }

  // If the error is different (not ApiError)
  return res
    .status(500)
    .json(new ApiResponse(false, 'Internal Server Error', null, [err.message]));
}
