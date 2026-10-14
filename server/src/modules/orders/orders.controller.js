import * as ordersService from './orders.service.js';

export async function checkout(req, res) {
  res.status(201).json(await ordersService.checkout(req.user.id, req.body));
}

export async function listMine(req, res) {
  res.json(await ordersService.listUserOrders(req.user.id));
}

export async function getById(req, res) {
  res.json(await ordersService.getOrderForUser(req.params.id, req.user));
}

export async function cancel(req, res) {
  res.json(await ordersService.cancelOrder(req.params.id, req.user.id));
}

export async function listAll(req, res) {
  res.json(await ordersService.listAllOrders(req.query));
}

export async function updateStatus(req, res) {
  res.json(await ordersService.updateOrderStatus(req.params.id, req.body.status));
}
