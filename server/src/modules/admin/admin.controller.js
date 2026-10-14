import * as adminService from './admin.service.js';

export async function stats(_req, res) {
  res.json(await adminService.getDashboardStats());
}
