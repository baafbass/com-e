import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../../config/db.js';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';
import { PUBLIC_USER_COLUMNS } from '../users/users.service.js';

const SALT_ROUNDS = 10;

const signToken = (user) =>
  jwt.sign({ sub: String(user.id), role: user.role }, env.jwtSecret, { expiresIn: env.jwtExpiresIn });

const toSession = (user) => ({ user, token: signToken(user) });

export async function register({ name, email, password }) {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const [user] = await query(
    `INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING ${PUBLIC_USER_COLUMNS}`,
    [name, email, passwordHash],
  );
  return toSession(user);
}

export async function login({ email, password }) {
  const [account] = await query(`SELECT ${PUBLIC_USER_COLUMNS}, password_hash FROM users WHERE email = $1`, [email]);
  const isValid = account && (await bcrypt.compare(password, account.passwordHash));

  // Same message for unknown email and wrong password, to avoid revealing which accounts exist.
  if (!isValid) throw ApiError.unauthorized('Invalid email or password');

  const { passwordHash: _hidden, ...user } = account;
  return toSession(user);
}

export async function updateProfile(userId, { name, email }) {
  const [user] = await query(
    `UPDATE users SET name = $2, email = $3, updated_at = NOW() WHERE id = $1 RETURNING ${PUBLIC_USER_COLUMNS}`,
    [userId, name, email],
  );
  return user;
}

export async function changePassword(userId, { currentPassword, newPassword }) {
  const [account] = await query('SELECT password_hash FROM users WHERE id = $1', [userId]);
  const isValid = account && (await bcrypt.compare(currentPassword, account.passwordHash));
  if (!isValid) throw ApiError.badRequest('Current password is incorrect');

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  await query('UPDATE users SET password_hash = $2, updated_at = NOW() WHERE id = $1', [userId, passwordHash]);
}
