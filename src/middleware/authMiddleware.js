// src/middleware/authMiddleware.js
import jwt from 'jsonwebtoken';
import { ApiError } from '../utils/ApiError.js';

/**
 * Checks Bearer-token in description Authorization
 * and adds req.user = { id: <userId> } at valid token.
 */
export function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth) {
      return next(new ApiError(401, 'Authorization header missing'));
    }

    const [scheme, token] = auth.split(' ');
    if (scheme !== 'Bearer' || !token) {
      return next(
        new ApiError(401, 'Invalid Authorization header format. Expected: Bearer <token>')
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // We are adjusting to possible field names in the token.
    const userId = payload.id || payload._id || payload.sub;
    if (!userId) {
      return next(new ApiError(401, 'Invalid token payload'));
    }

    req.user = { id: userId };
    return next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return next(new ApiError(401, 'Token expired'));
    }
    return next(new ApiError(401, 'Invalid or expired token'));
  }
}


