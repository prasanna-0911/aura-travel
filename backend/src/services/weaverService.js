const Activity = require('../models/Activity');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const { extractFromQuery } = require('./nlpService');

function scoreTagOverlap(sourceTags = [], queryTags = []) {
  return sourceTags.filter((tag) =>
    queryTags.some((queryTag) => tag.includes(queryTag) || queryTag.includes(tag))
  ).length;
}

function calculateActivityScore(activity, queryTags) {
  const tagOverlap = scoreTagOverlap(activity.experiential_tags, queryTags);
  const ratingScore = (activity.user_rating || 0) * 2;
  const budgetBonus = activity.cost_inr < 1000 ? 1 : 0;
  return tagOverlap * 3 + ratingScore + budgetBonus;
}

function calculateHotelScore(hotel, queryTags, budget) {
  const tagOverlap = scoreTagOverlap(hotel.experiential_tags, queryTags);
  let budgetScore = 0;

  if (budget === 'budget-friendly' && hotel.price_per_night < 2500) budgetScore = 3;
  if (budget === 'mid-range' && hotel.price_per_night >= 2500 && hotel.price_per_night <= 8000) budgetScore = 3;
  if (budget === 'premium' && hotel.price_per_night > 8000) budgetScore = 3;

  return tagOverlap * 3 + (hotel.user_rating || 0) * 2 + budgetScore;
}

function calculateRestaurantScore(restaurant, queryTags) {
  return scoreTagOverlap(restaurant.experiential_tags, queryTags) * 2 + (restaurant.user_rating || 0) * 2;
}

function determineBestDestination(nlpResult) {
  if (nlpResult.destination) return nlpResult.destination;

  const tags = nlpResult.tags;
  if (['beach', 'coastal', 'water-sports', 'nightlife', 'party'].some((tag) => tags.includes(tag))) return 'Goa';
  if (['mountain', 'hiking', 'adventure', 'snow', 'trekking', 'nature', 'camping'].some((tag) => tags.includes(tag))) return 'Manali';
  if (['urban', 'city', 'cultural', 'heritage', 'historical', 'food'].some((tag) => tags.includes(tag))) return 'Pune';
  return 'Goa';
}

function getScheduledTime(timeSlot) {
  if (timeSlot === 'morning') return '09:00 AM';
  if (timeSlot === 'evening') return '06:00 PM';
  return '02:00 PM';
}

function plain(document) {
  if (!document) return null;
  if (typeof document.toObject === 'function') return document.toObject();
  return document;
}

async function generateItineraryFromQuery(query, overrides = {}) {
  const startTime = Date.now();
  const nlpResult = extractFromQuery(query || '');

  // Use destination from overrides (passed from hybridWeaverService), fallback to NLP result
  const destination = overrides.destination || nlpResult.destination;

  // If no destination, throw error instead of using default
  if (!destination) {
    throw new Error('Could not determine destination. Please specify a destination (e.g., "trip to Paris")');
  }

  const duration = Math.max(1, Math.min(Number(overrides.duration || nlpResult.duration || 3), 7));
  const queryTags = Array.from(new Set([...(nlpResult.tags || []), ...((overrides.tags || []).filter(Boolean))]));

  const destinationActivities = await Activity.find({ destination }).lean();

  // If no activities in database, throw error to trigger RAG/external fallback
  if (destinationActivities.length === 0) {
    throw new Error(`No data found for "${destination}". This destination is not yet in our database. Try: Goa, Manali, Jaipur, Delhi, Mumbai, or other popular destinations.`);
  }

  const scoredActivities = destinationActivities
    .map((activity) => ({ activity, score: calculateActivityScore(activity, queryTags) }))
    .sort((a, b) => b.score - a.score || (b.activity.user_rating || 0) - (a.activity.user_rating || 0));

  const selectedActivities = scoredActivities.slice(0, duration * 3);
  const pools = {
    morning: selectedActivities.filter((item) => item.activity.best_time === 'morning'),
    afternoon: selectedActivities.filter((item) => item.activity.best_time === 'afternoon' || item.activity.best_time === 'anytime'),
    evening: selectedActivities.filter((item) => item.activity.best_time === 'evening')
  };

  const used = new Set();
  const takeActivity = (slot) => {
    const preferred = pools[slot].find((item) => !used.has(item.activity.id));
    const fallback = selectedActivities.find((item) => !used.has(item.activity.id));
    const selected = preferred || fallback;
    if (!selected) return null;
    used.add(selected.activity.id);
    return selected.activity;
  };

  const days = [];
  for (let dayNum = 1; dayNum <= duration; dayNum += 1) {
    const date = new Date();
    date.setDate(date.getDate() + dayNum);

    const activities = ['morning', 'afternoon', 'evening']
      .map((timeSlot) => {
        const activity = takeActivity(timeSlot);
        if (!activity) return null;
        return { timeSlot, activity, scheduledTime: getScheduledTime(timeSlot) };
      })
      .filter(Boolean);

    days.push({
      day: dayNum,
      date: date.toISOString().split('T')[0],
      activities
    });
  }

  const hotels = await Hotel.find({ destination }).lean();
  const selectedHotel = hotels
    .map((hotel) => ({ hotel, score: calculateHotelScore(hotel, queryTags, nlpResult.budget) }))
    .sort((a, b) => b.score - a.score)[0]?.hotel || null;

  const restaurants = await Restaurant.find({ destination }).lean();
  const recommendedRestaurants = restaurants
    .map((restaurant) => ({ restaurant, score: calculateRestaurantScore(restaurant, queryTags) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.restaurant);

  const activityCost = days.reduce(
    (total, day) => total + day.activities.reduce((dayTotal, item) => dayTotal + (item.activity.cost_inr || 0), 0),
    0
  );
  const hotelCost = selectedHotel ? selectedHotel.price_per_night * Math.max(duration - 1, 1) : 0;
  const foodAverage = recommendedRestaurants.length
    ? recommendedRestaurants.reduce((sum, restaurant) => sum + restaurant.avg_cost_per_person, 0) / recommendedRestaurants.length
    : 700;
  const totalCost = Math.round(activityCost + hotelCost + foodAverage * duration * 2);

  const matchedTags = new Set();
  days.forEach((day) => {
    day.activities.forEach((item) => {
      item.activity.experiential_tags.forEach((tag) => {
        if (queryTags.some((queryTag) => tag.includes(queryTag) || queryTag.includes(tag))) {
          matchedTags.add(tag);
        }
      });
    });
  });

  return {
    extracted: nlpResult,
    itinerary: {
      id: `itinerary-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      destination,
      duration,
      days,
      hotel: plain(selectedHotel),
      recommendedRestaurants: recommendedRestaurants.map(plain),
      totalCost,
      matchedTags: Array.from(matchedTags),
      generationTime: Math.round(((Date.now() - startTime) / 1000) * 100) / 100,
      confidence: nlpResult.confidence
    }
  };
}

module.exports = { generateItineraryFromQuery, determineBestDestination };
