import * as categoriesService from './categories.service.js';

export async function list(_req, res) {
  res.json(await categoriesService.listCategories());
}

export async function create(req, res) {
  res.status(201).json(await categoriesService.createCategory(req.body));
}

export async function update(req, res) {
  res.json(await categoriesService.updateCategory(req.params.id, req.body));
}

export async function remove(req, res) {
  await categoriesService.deleteCategory(req.params.id);
  res.status(204).end();
}
