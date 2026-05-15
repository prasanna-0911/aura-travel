const { generateItineraryFromQuery } = require('./weaverService');
const ragService = require('./ragService');
const externalApiService = require('./externalApiService');
const { extractFromQuery } = require('./nlpService');

const CURATED_DESTINATIONS = ['Goa', 'Manali', 'Pune', 'Mumbai', 'Delhi', 'Jaipur', 'Kerala'];

async function hybridGenerateItinerary(query, options = {}) {
  const { useRag = false, includeExternalData = true } = options;
  const nlpResult = extractFromQuery(query || '');
  const destination = options.destination || nlpResult.destination || 'Goa';
  const duration = Math.max(1, Math.min(Number(options.duration || nlpResult.duration || 3), 14));

  // Check if destination is curated (has database data)
  const isCuratedDestination = CURATED_DESTINATIONS.some(
    d => d.toLowerCase() === destination.toLowerCase()
  );

  // Strategy: Use RAG if requested or for non-curated destinations
  if (useRag || (!isCuratedDestination && process.env.RAG_API_URL)) {
    try {
      const ragResult = await ragService.generateItinerary(query, {
        city: destination,
        days: duration,
        budget: nlpResult.budget || 'medium'
      });

      // Optionally enhance with external API data
      let enhancedData = {};
      if (includeExternalData && process.env.ENABLE_EXTERNAL_APIS === 'true') {
        const [hotels, activities, restaurants] = await Promise.allSettled([
          externalApiService.searchHotels(destination, getFutureDate(1), getFutureDate(duration + 1)),
          externalApiService.searchActivities(destination),
          externalApiService.searchRestaurants(destination)
        ]);

        enhancedData = {
          externalHotels: hotels.value?.hotels || [],
          externalActivities: activities.value?.results || [],
          externalRestaurants: restaurants.value?.results || []
        };
      }

      return {
        source: 'rag',
        rag: ragResult,
        ...enhancedData,
        nlp: nlpResult
      };
    } catch (ragError) {
      console.warn('RAG generation failed, falling back to database:', ragError.message);
      // Fall through to database method
    }
  }

  // Use database-based generation for curated destinations
  const { extracted, itinerary } = await generateItineraryFromQuery(query, {
    destination,
    duration,
    tags: options.tags
  });

  // Optionally enhance with external API data
  let enhancedData = {};
  if (includeExternalData && (process.env.ENABLE_EXTERNAL_APIS === 'true' || !isCuratedDestination)) {
    const [hotels, activities, restaurants] = await Promise.allSettled([
      externalApiService.searchHotels(destination, getFutureDate(1), getFutureDate(duration + 1)),
      externalApiService.searchActivities(destination),
      externalApiService.searchRestaurants(destination)
    ]);

    enhancedData = {
      externalHotels: hotels.value?.hotels || [],
      externalActivities: activities.value?.results || [],
      externalRestaurants: restaurants.value?.results || []
    };
  }

  return {
    source: 'database',
    extracted,
    itinerary,
    ...enhancedData,
    nlp: extracted
  };
}

function getFutureDate(daysFromNow) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

async function generateWithExternalDataOnly(destination, duration, preferences) {
  const [hotels, activities, restaurants, flights] = await Promise.allSettled([
    externalApiService.searchHotels(destination, getFutureDate(1), getFutureDate(duration + 1)),
    externalApiService.searchActivities(destination),
    externalApiService.searchRestaurants(destination),
    preferences.origin ? externalApiService.searchFlights(
      preferences.origin,
      destination,
      getFutureDate(7),
      preferences.travelers || 1
    ) : null
  ]);

  return {
    destination,
    duration,
    hotels: hotels.value?.hotels || [],
    activities: activities.value?.results || [],
    restaurants: restaurants.value?.results || [],
    flights: flights.value?.flights || []
  };
}

module.exports = {
  hybridGenerateItinerary,
  generateWithExternalDataOnly,
  CURATED_DESTINATIONS
};