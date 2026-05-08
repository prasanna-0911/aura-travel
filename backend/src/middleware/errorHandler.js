function notFound(req, res, next) {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
}

function errorHandler(err, req, res, next) {
  void next;

  const statusCode = err.statusCode || err.status || 500;
  const response = {
    success: false,
    message: err.message || 'Server error'
  };

  if (process.env.NODE_ENV !== 'production') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = { notFound, errorHandler };
