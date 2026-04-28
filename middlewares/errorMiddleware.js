// Captura rutas que no existen
const notFound = (req, res, next) => {
  const error = new Error(`No se encontró la ruta - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// Captura cualquier error del servidor
const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    mensaje: err.message,
    codigo: statusCode === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR',
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = { notFound, errorHandler };