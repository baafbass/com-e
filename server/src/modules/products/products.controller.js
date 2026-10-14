import * as productsService from './products.service.js';

export async function list(req, res) {
  res.json(await productsService.listProducts(req.query));
}

export async function getBySlug(req, res) {
  res.json(await productsService.getProductBySlug(req.params.slug));
}

export async function create(req, res) {
  res.status(201).json(await productsService.createProduct(req.body));
}

export async function update(req, res) {
  res.json(await productsService.updateProduct(req.params.id, req.body));
}

export async function remove(req, res) {
  await productsService.deleteProduct(req.params.id);
  res.status(204).end();
}
