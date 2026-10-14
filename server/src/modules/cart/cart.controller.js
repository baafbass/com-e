import * as cartService from './cart.service.js';

export async function get(req, res) {
  res.json(await cartService.getCart(req.user.id));
}

export async function addItem(req, res) {
  res.status(201).json(await cartService.addItem(req.user.id, req.body));
}

export async function updateItem(req, res) {
  res.json(await cartService.setItemQuantity(req.user.id, req.params.productId, req.body.quantity));
}

export async function removeItem(req, res) {
  res.json(await cartService.removeItem(req.user.id, req.params.productId));
}

export async function clear(req, res) {
  await cartService.clearCart(req.user.id);
  res.status(204).end();
}

export async function merge(req, res) {
  res.json(await cartService.mergeCart(req.user.id, req.body.items));
}
