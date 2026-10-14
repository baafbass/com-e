import { ApiError } from '../utils/ApiError.js';

/**
 * Validates `req[source]` against a Zod schema and replaces it with the parsed value
 * (trimmed strings, coerced numbers, defaults applied).
 */
export const validate =
  (schema, source = 'body') =>
  (req, _res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const details = result.error.issues.map((issue) => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));
      return next(ApiError.badRequest('Validation failed', details));
    }

    // Express 5 exposes `req.query` as a getter, so define an own property instead of assigning.
    Object.defineProperty(req, source, { value: result.data, writable: true, enumerable: true, configurable: true });
    next();
  };
