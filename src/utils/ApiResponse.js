// src/utils/ApiResponse.js

/**
 * Клас для стандартизації відповідей від API.
 * Завжди повертаємо однакову структуру:
 * - success (true/false)
 * - message (текст повідомлення)
 * - data (результат, якщо є)
 * - errors (масив деталей помилок, якщо є)
 */
export class ApiResponse {
  constructor(success, message, data = null, errors = []) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.errors = errors;
  }
}
