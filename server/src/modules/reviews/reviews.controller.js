import * as reviewsService from './reviews.service.js';

export async function list(req, res) {
  res.json(await reviewsService.listReviews(req.params.id));
}

export async function upsert(req, res) {
  res.status(201).json(await reviewsService.upsertReview(req.params.id, req.user.id, req.body));
}
