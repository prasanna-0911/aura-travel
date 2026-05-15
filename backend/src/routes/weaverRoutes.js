const express = require('express');
const { TAG_DICTIONARY } = require('../utils/tagDictionary');
const { generateItineraryFromQuery } = require('../services/weaverService');
const { hybridGenerateItinerary, generateWithExternalDataOnly, CURATED_DESTINATIONS } = require('../services/hybridWeaverService');
const externalApiService = require('../services/externalApiService');
const ragService = require('../services/ragService');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.post('/generate', asyncHandler(async (req, res) => {
  const { query, duration, budget, destination, tags, useRag, includeExternal } = req.body;

  if (!query || String(query).trim().length < 3) {
    return res.status(400).json({ success: false, message: 'Please describe the trip you want.' });
  }

  const result = await hybridGenerateItinerary(query, {
    duration,
    budget,
    destination,
    tags,
    useRag: useRag === true,
    includeExternalData: includeExternal !== false
  });

  if (result.source === 'rag') {
    res.json({
      success: true,
      source: 'rag',
      destination: result.rag.destination,
      itinerary: result.rag.itinerary,
      externalHotels: result.externalHotels,
      externalActivities: result.externalActivities,
      externalRestaurants: result.externalRestaurants,
      nlp: result.nlp
    });
  } else {
    res.json({
      success: true,
      source: 'database',
      extracted_tags: result.extracted.tags,
      destination: result.itinerary.destination,
      itinerary: result.itinerary,
      total_cost: result.itinerary.totalCost,
      generation_time: result.itinerary.generationTime,
      externalHotels: result.externalHotels,
      externalActivities: result.externalActivities,
      externalRestaurants: result.externalRestaurants,
      nlp: result.extracted
    });
  }
}));

// New endpoint: Generate using only external APIs (no database)
router.post('/generate-external', asyncHandler(async (req, res) => {
  const { destination, duration, origin, travelers, query } = req.body;

  if (!destination) {
    return res.status(400).json({ success: false, message: 'Destination is required' });
  }

  const result = await generateWithExternalDataOnly(destination, duration || 3, {
    origin,
    travelers,
    query
  });

  res.json({
    success: true,
    source: 'external',
    ...result
  });
}));

// New endpoint: Search places using Google Places API
router.post('/places/search', asyncHandler(async (req, res) => {
  const { query, type } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required' });
  }

  const result = await externalApiService.searchPlaces(query, type);
  res.json(result);
}));

// New endpoint: Get place details
router.get('/places/:placeId', asyncHandler(async (req, res) => {
  const { placeId } = req.params;
  const result = await externalApiService.getPlaceDetails(placeId);
  res.json(result);
}));

// New endpoint: Search hotels
router.post('/hotels/search', asyncHandler(async (req, res) => {
  const { destination, checkin, checkout, guests } = req.body;

  if (!destination) {
    return res.status(400).json({ success: false, message: 'Destination is required' });
  }

  const result = await externalApiService.searchHotels(destination, checkin, checkout, guests);
  res.json(result);
}));

// New endpoint: Search activities
router.get('/activities/:destination', asyncHandler(async (req, res) => {
  const { destination } = req.params;
  const result = await externalApiService.searchActivities(destination);
  res.json(result);
}));

// New endpoint: Check RAG service health
router.get('/rag/health', asyncHandler(async (req, res) => {
  const health = await ragService.checkHealth();
  res.json(health);
}));

router.get('/destinations', asyncHandler(async (req, res) => {
  const destinations = await Activity.distinct('destination');
  res.json({ success: true, destinations: destinations.sort() });
}));

router.get('/tags', (req, res) => {
  res.json({ success: true, tags: TAG_DICTIONARY });
});

module.exports = router;
