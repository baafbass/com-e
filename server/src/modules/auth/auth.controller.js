import * as authService from './auth.service.js';

export async function register(req, res) {
  res.status(201).json(await authService.register(req.body));
}

export async function login(req, res) {
  res.json(await authService.login(req.body));
}

export function me(req, res) {
  res.json(req.user);
}

export async function updateProfile(req, res) {
  res.json(await authService.updateProfile(req.user.id, req.body));
}

export async function changePassword(req, res) {
  await authService.changePassword(req.user.id, req.body);
  res.status(204).end();
}
