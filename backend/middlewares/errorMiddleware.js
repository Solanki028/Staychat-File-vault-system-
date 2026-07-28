/**
 * Global Error Handler Middleware for Express
 */
export const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || (res.statusCode !== 200 ? res.statusCode : 500);

  // File limit error handling
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: `File size exceeds maximum threshold of ${process.env.MAX_FILE_SIZE_MB || 25}MB.`,
      errorCode: 'FILE_TOO_LARGE'
    });
  }

  const response = {
    success: false,
    message: err.message || 'An unexpected error occurred on the server.',
    errorCode: err.errorCode || 'INTERNAL_SERVER_ERROR'
  };

  if (err.errors) {
    response.errors = err.errors;
  }

  if (process.env.NODE_ENV === 'development' && err.stack) {
    response.stack = err.stack;
  }

  return res.status(statusCode).json(response);
};

export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Route Not Found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.errorCode = 'NOT_FOUND';
  next(error);
};
