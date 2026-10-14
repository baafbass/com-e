import * as usersService from './users.service.js';

export async function list(_req, res) {
  res.json(await usersService.listUsers());
}

export async function updateRole(req, res) {
  res.json(await usersService.updateUserRole(req.params.id, req.body.role, req.user.id));
}
