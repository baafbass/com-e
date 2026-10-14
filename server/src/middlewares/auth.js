import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { findUserById } from '../modules/users/users.service.js';
import { ApiError } from '../utils/ApiError.js';

const readBearerToken = (req) => {
  const [scheme, token] = (req.headers.authorization ?? '').split(' ');
  return scheme === 'Bearer' && token ? token : null;
};

/** Requires a valid JWT and attaches the current user (fresh from the database) to `req.user`. */
export async function authenticate(req, _res, next) {
  const token = readBearerToken(req);
  if (!token) throw ApiError.unauthorized();

  let payload;
  try {
    payload = jwt.verify(token, env.jwtSecret);
  } catch {
    throw ApiError.unauthorized('Your session has expired, please log in again');
  }

  const user = await findUserById(Number(payload.sub));
  if (!user) throw ApiError.unauthorized('Account no longer exists');

  req.user = user;
  next();
}

/** Restricts a route to users having one of the given roles. Use after `authenticate`. */
export const authorize =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user?.role)) throw ApiError.forbidden();
    next();
  };
