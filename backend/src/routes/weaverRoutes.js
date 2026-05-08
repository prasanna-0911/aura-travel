const express = require('express');
const { TAG_DICTIONARY } = require('../utils/tagDictionary');
const { generateItineraryFromQuery } = require('../services/weaverService');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/generate', asyncHandler(async (req, res) => {
  const { query, duration, budget, destination, tags } = req.body;

  if (!query || String(query).trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Please describe the trip you want.' });
  }

  const { extracted, itinerary } = await generateItineraryFromQuery(query, { duration, budget, destination, tags });

  res.json({
    success: true,
    extracted_tags: extracted.tags,
    destination: itinerary.destination,
    itinerary,
    total_cost: itinerary.totalCost,
    generation_time: itinerary.generationTime,
    nlp: extracted
  });
}));

router.get('/destinations', asyncHandler(async (req, res) => {
  const destinations = await Activity.distinct('destination');
  res.json({ success: true, destinations: destinations.sort() });
}));

router.get('/tags', (req, res) => {
  res.json({ success: true, tags: TAG_DICTIONARY });
});

module.exports = router;
