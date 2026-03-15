/**
 * Error Handler Middleware
 * Catches all errors thrown in routes and returns a consistent JSON error response
 */

const errorHandler = (err, req, res, next) => {
  // Log the error for debugging
  console.error('❌ Error:', err.message);
  if (process.env.NODE_ENV === 'development') {
    console.error(err.stack);
  }

  // Determine the HTTP status code
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    error: err.message || 'An unexpected error occurred',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;
