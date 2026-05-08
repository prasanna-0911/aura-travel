const express = require('express');
const Activity = require('../models/Activity');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

function parseTags(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value;
  return String(value).split(',').map((tag) => tag.trim()).filter(Boolean);
}

function buildCommonQuery(req) {
  const query = {};
  const tags = parseTags(req.query.tags);

  if (req.query.destination) query.destination = req.query.destination;
  if (req.query.category) query.category = req.query.category;
  if (tags.length) query.experiential_tags = { $in: tags };

  if (req.query.search) {
    const pattern = new RegExp(String(req.query.search).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    query.$or = [{ name: pattern }, { description: pattern }, { experiential_tags: pattern }];
  }

  return query;
}

function sortFromQuery(req, fallback = '-user_rating') {
  const sortBy = req.query.sortBy;
  if (sortBy === 'price') return 'cost_inr price_per_night avg_cost_per_person';
  if (sortBy === 'duration') return 'duration_hours';
  if (sortBy === 'rating') return '-user_rating';
  return fallback;
}

async function list(Model, req, extra = {}) {
  const page = Math.max(Number(req.query.page || 1), 1);
  const limit = Math.min(Math.max(Number(req.query.limit || 200), 1), 500);
  const query = { ...buildCommonQuery(req), ...extra };
  const [items, total] = await Promise.all([
    Model.find(query).sort(sortFromQuery(req)).skip((page - 1) * limit).limit(limit).lean(),
    Model.countDocuments(query)
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) || 1 };
}

router.get('/activities', asyncHandler(async (req, res) => {
  const result = await list(Activity, req);
  res.json({ success: true, activities: result.items, total: result.total, page: result.page, pages: result.pages });
}));

router.get('/hotels', asyncHandler(async (req, res) => {
  const result = await list(Hotel, req);
  res.json({ success: true, hotels: result.items, total: result.total, page: result.page, pages: result.pages });
}));

router.get('/restaurants', asyncHandler(async (req, res) => {
  const result = await list(Restaurant, req);
  res.json({ success: true, restaurants: result.items, total: result.total, page: result.page, pages: result.pages });
}));

module.exports = router;
