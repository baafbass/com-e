import { isProduction } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Friendly messages for PostgreSQL unique constraints.
const UNIQUE_CONSTRAINT_MESSAGES = {
  users_email_key: 'Email is already registered',
  categories_name_key: 'A category with this name already exists',
  categories_slug_key: 'A category with this name already exists',
  products_slug_key: 'A product with this name already exists',
};

/** Translates known low-level errors (PostgreSQL, body parser) into ApiErrors. */
function normalizeError(error) {
  if (error instanceof ApiError) return error;

  switch (error.code) {
    case '23505':
      return ApiError.conflict(UNIQUE_CONSTRAINT_MESSAGES[error.constraint] ?? 'This record already exists');
    case '23503':
      return ApiError.badRequest('A referenced record does not exist');
    case '23514':
      return ApiError.badRequest('A value is outside the allowed range');
    default:
      break;
  }

  if (error.type === 'entity.parse.failed') return ApiError.badRequest('Malformed JSON body');

  return error;
}

export function notFoundHandler(req, _res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

// Express recognises error handlers by their four parameters.
// eslint-disable-next-line no-unused-vars
export function errorHandler(rawError, _req, res, _next) {
  const error = normalizeError(rawError);
  const statusCode = error.statusCode ?? 500;
  const isServerError = statusCode >= 500;

  if (isServerError) console.error(rawError);

  res.status(statusCode).json({
    message: isServerError && isProduction ? 'Something went wrong, please try again later' : error.message,
    ...(error.details && { details: error.details }),
    ...(isServerError && !isProduction && { stack: rawError.stack }),
  });
}
