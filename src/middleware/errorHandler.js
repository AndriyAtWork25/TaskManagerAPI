export function errorHandler(err, req, res, next) {
  console.error(err); // Логування помилки в консоль (пізніше можна замінити на більш просунутий логгер)

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
}
