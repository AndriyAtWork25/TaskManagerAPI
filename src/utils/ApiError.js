// utils/ApiError.js

/**
 * Клас для створення однакового формату помилок у всьому проєкті.
 * Ми передаємо:
 * - statusCode (HTTP код)
 * - message (текст помилки)
 * - errors (масив додаткових повідомлень або деталей)
 */
export class ApiError extends Error {
  constructor(statusCode, message, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }
}

