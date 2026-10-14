import { query } from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';

export const PUBLIC_USER_COLUMNS = 'id, name, email, role, created_at';

export async function findUserById(id) {
  const [user] = await query(`SELECT ${PUBLIC_USER_COLUMNS} FROM users WHERE id = $1`, [id]);
  return user ?? null;
}

export function listUsers() {
  return query(
    `SELECT u.id, u.name, u.email, u.role, u.created_at, COUNT(o.id) AS order_count
     FROM users u
     LEFT JOIN orders o ON o.user_id = u.id
     GROUP BY u.id
     ORDER BY u.created_at DESC`,
  );
}

export async function updateUserRole(targetId, role, actingUserId) {
  if (targetId === actingUserId) throw ApiError.forbidden('You cannot change your own role');

  const [user] = await query(
    `UPDATE users SET role = $2, updated_at = NOW() WHERE id = $1 RETURNING ${PUBLIC_USER_COLUMNS}`,
    [targetId, role],
  );
  if (!user) throw ApiError.notFound('User not found');
  return user;
}
