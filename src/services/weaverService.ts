import { activities, hotels, restaurants, Activity, Hotel, Restaurant } from '@/data';
import { NLPResult } from '@/utils/nlp';
import { apiRequest } from './apiClient';

export interface ItineraryDay {
  day: number;
  date: string;
  activities: {
    timeSlot: 'morning' | 'afternoon' | 'evening';
    activity: Activity;
    scheduledTime: string;
  }[];
}

// External API data types
export interface ExternalHotel {
  id: string;
  name: string;
  rating: number;
  reviewScore: number;
  reviewCount?: number;
  address?: string;
  distance?: string;
  price: number;
  currency?: string;
  amenities?: string[];
  photos?: string[];
}

export interface ExternalActivity {
  placeId: string;
  name: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types?: string[];
  location?: { lat: number; lng: number };
  photos?: { photoReference: string; width: number; height: number }[];
}

export interface ExternalRestaurant {
  placeId: string;
  name: string;
  address?: string;
  rating?: number;
  userRatingsTotal?: number;
  priceLevel?: number;
  types?: string[];
  location?: { lat: number; lng: number };
  photos?: { photoReference: string; width: number; height: number }[];
}

export interface GeneratedItinerary {
  id: string;
  destination: string;
  duration: number;
  days: ItineraryDay[];
  hotel: Hotel | null;
  recommendedRestaurants: Restaurant[];
  totalCost: number;
  matchedTags: string[];
  generationTime: number;
  confidence: number;
  // External API data
  externalHotels?: ExternalHotel[];
  externalActivities?: ExternalActivity[];
  externalRestaurants?: ExternalRestaurant[];
  source?: 'database' | 'rag' | 'external';
}

// Calculate activity score based on tag matching
function calculateActivityScore(activity: Activity, queryTags: string[]): number {
  const tagOverlap = activity.experiential_tags.filter(tag => 
    queryTags.some(qTag => 
      tag.includes(qTag) || qTag.includes(tag)
    )
  ).length;
  
  const ratingScore = activity.user_rating * 2;
  const budgetBonus = activity.cost_inr < 1000 ? 1 : 0;
  
  return (tagOverlap * 3) + ratingScore + budgetBonus;
}

// Calculate hotel score
function calculateHotelScore(hotel: Hotel, queryTags: string[], budget: string | null): number {
  const tagOverlap = hotel.experiential_tags.filter(tag => 
    queryTags.some(qTag => 
      tag.includes(qTag) || qTag.includes(tag)
    )
  ).length;
  
  let budgetScore = 0;
  if (budget === 'budget-friendly' && hotel.price_per_night < 2000) budgetScore = 3;
  else if (budget === 'mid-range' && hotel.price_per_night >= 2000 && hotel.price_per_night <= 8000) budgetScore = 3;
  else if (budget === 'premium' && hotel.price_per_night > 8000) budgetScore = 3;
  
  return (tagOverlap * 3) + (hotel.user_rating * 2) + budgetScore;
}

// Calculate restaurant score
function calculateRestaurantScore(restaurant: Restaurant, queryTags: string[]): number {
  const tagOverlap = restaurant.experiential_tags.filter(tag => 
    queryTags.some(qTag => 
      tag.includes(qTag) || qTag.includes(tag)
    )
  ).length;
  
  return (tagOverlap * 2) + (restaurant.user_rating * 2);
}

// Get time slot for activity (exported for potential use in other components)
export function getTimeSlot(bestTime: string): 'morning' | 'afternoon' | 'evening' {
  if (bestTime === 'morning') return 'morning';
  if (bestTime === 'afternoon') return 'afternoon';
  if (bestTime === 'evening') return 'evening';
  return 'afternoon'; // default for 'anytime'
}

// Get scheduled time based on time slot (exported for potential use in other components)
export function getScheduledTime(timeSlot: 'morning' | 'afternoon' | 'evening'): string {
  switch (timeSlot) {
    case 'morning': return '09:00 AM';
    case 'afternoon': return '02:00 PM';
    case 'evening': return '06:00 PM';
  }
}

// Determine best destination based on tags
function determineBestDestination(nlpResult: NLPResult): string {
  // If destination is explicitly mentioned, use it
  if (nlpResult.destination) {
    return nlpResult.destination;
  }
  
  // Otherwise, infer from tags
  const tags = nlpResult.tags;
  
  // Beach-related tags -> Goa
  const beachTags = ['beach', 'coastal', 'seaside', 'water-sports', 'nightlife', 'party'];
  if (beachTags.some(t => tags.includes(t))) {
    return 'Goa';
  }
  
  // Mountain-related tags -> Manali
  const mountainTags = ['mountain', 'hiking', 'adventure', 'snow', 'trekking', 'nature', 'camping'];
  if (mountainTags.some(t => tags.includes(t))) {
    return 'Manali';
  }
  
  // Urban/cultural tags -> Pune
  const urbanTags = ['urban', 'city', 'cultural', 'heritage', 'historical', 'food'];
  if (urbanTags.some(t => tags.includes(t))) {
    return 'Pune';
  }
  
  // Default to Goa (most popular)
  return 'Goa';
}

// Generate unique ID
function generateId(): string {
  return `itinerary-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Main function to generate itinerary
export async function generateItinerary(nlpResult: NLPResult): Promise<GeneratedItinerary> {
  try {
    const response = await apiRequest<{
      success: boolean;
      itinerary: GeneratedItinerary;
      externalHotels?: ExternalHotel[];
      externalActivities?: ExternalActivity[];
      externalRestaurants?: ExternalRestaurant[];
      source?: string;
    }>('/weaver/generate', {
      method: 'POST',
      body: JSON.stringify({
        query: nlpResult.originalQuery,
        duration: nlpResult.duration,
        budget: nlpResult.budget,
        destination: nlpResult.destination,
        tags: nlpResult.tags
      })
    });

    // Attach external data to the itinerary
    return {
      ...response.itinerary,
      externalHotels: response.externalHotels,
      externalActivities: response.externalActivities,
      externalRestaurants: response.externalRestaurants,
      source: response.source as 'database' | 'rag' | 'external' | undefined
    };
  } catch (error) {
    console.warn('Using local itinerary generator fallback:', error);
  }

  const startTime = performance.now();
  
  // Determine destination
  const destination = determineBestDestination(nlpResult);
  const duration = nlpResult.duration;
  const queryTags = nlpResult.tags;
  
  // Filter activities by destination
  const destinationActivities = activities.filter(a => a.destination === destination);
  
  // Score and sort activities
  const scoredActivities = destinationActivities
    .map(activity => ({
      activity,
      score: calculateActivityScore(activity, queryTags)
    }))
    .sort((a, b) => b.score - a.score);
  
  // Get top activities (3 per day)
  const selectedActivities = scoredActivities.slice(0, duration * 3);
  
  // Group activities by time slot
  const morningActivities = selectedActivities.filter(a => a.activity.best_time === 'morning');
  const afternoonActivities = selectedActivities.filter(a => a.activity.best_time === 'afternoon' || a.activity.best_time === 'anytime');
  const eveningActivities = selectedActivities.filter(a => a.activity.best_time === 'evening');
  
  // Build itinerary days
  const days: ItineraryDay[] = [];
  let activityIndex = { morning: 0, afternoon: 0, evening: 0 };
  
  for (let dayNum = 1; dayNum <= duration; dayNum++) {
    const dayActivities: ItineraryDay['activities'] = [];
    
    // Morning activity
    if (morningActivities[activityIndex.morning]) {
      dayActivities.push({
        timeSlot: 'morning',
        activity: morningActivities[activityIndex.morning].activity,
        scheduledTime: '09:00 AM'
      });
      activityIndex.morning++;
    } else if (afternoonActivities[activityIndex.afternoon]) {
      // Fallback to afternoon activity for morning slot
      dayActivities.push({
        timeSlot: 'morning',
        activity: afternoonActivities[activityIndex.afternoon].activity,
        scheduledTime: '10:00 AM'
      });
      activityIndex.afternoon++;
    }
    
    // Afternoon activity
    if (afternoonActivities[activityIndex.afternoon]) {
      dayActivities.push({
        timeSlot: 'afternoon',
        activity: afternoonActivities[activityIndex.afternoon].activity,
        scheduledTime: '02:00 PM'
      });
      activityIndex.afternoon++;
    }
    
    // Evening activity
    if (eveningActivities[activityIndex.evening]) {
      dayActivities.push({
        timeSlot: 'evening',
        activity: eveningActivities[activityIndex.evening].activity,
        scheduledTime: '06:00 PM'
      });
      activityIndex.evening++;
    } else if (afternoonActivities[activityIndex.afternoon]) {
      // Fallback
      dayActivities.push({
        timeSlot: 'evening',
        activity: afternoonActivities[activityIndex.afternoon].activity,
        scheduledTime: '05:00 PM'
      });
      activityIndex.afternoon++;
    }
    
    const date = new Date();
    date.setDate(date.getDate() + dayNum);
    
    days.push({
      day: dayNum,
      date: date.toISOString().split('T')[0],
      activities: dayActivities
    });
  }
  
  // Select best hotel
  const destinationHotels = hotels.filter(h => h.destination === destination);
  const scoredHotels = destinationHotels
    .map(hotel => ({
      hotel,
      score: calculateHotelScore(hotel, queryTags, nlpResult.budget)
    }))
    .sort((a, b) => b.score - a.score);
  
  const selectedHotel = scoredHotels[0]?.hotel || null;
  
  // Select top restaurants
  const destinationRestaurants = restaurants.filter(r => r.destination === destination);
  const scoredRestaurants = destinationRestaurants
    .map(restaurant => ({
      restaurant,
      score: calculateRestaurantScore(restaurant, queryTags)
    }))
    .sort((a, b) => b.score - a.score);
  
  const recommendedRestaurants = scoredRestaurants.slice(0, 3).map(r => r.restaurant);
  
  // Calculate total cost
  const activityCost = days.reduce((total, day) => 
    total + day.activities.reduce((dayTotal, a) => dayTotal + a.activity.cost_inr, 0), 0
  );
  const hotelCost = selectedHotel ? selectedHotel.price_per_night * (duration - 1) : 0;
  const estimatedFoodCost = recommendedRestaurants.length > 0 
    ? recommendedRestaurants.reduce((sum, r) => sum + r.avg_cost_per_person, 0) / recommendedRestaurants.length * duration * 2
    : 1000 * duration;
  
  const totalCost = activityCost + hotelCost + estimatedFoodCost;
  
  // Get matched tags
  const allMatchedTags = new Set<string>();
  days.forEach(day => {
    day.activities.forEach(a => {
      a.activity.experiential_tags.forEach(tag => {
        if (queryTags.some(qTag => tag.includes(qTag) || qTag.includes(tag))) {
          allMatchedTags.add(tag);
        }
      });
    });
  });
  
  const endTime = performance.now();
  const generationTime = (endTime - startTime) / 1000;
  
  return {
    id: generateId(),
    destination,
    duration,
    days,
    hotel: selectedHotel,
    recommendedRestaurants,
    totalCost: Math.round(totalCost),
    matchedTags: Array.from(allMatchedTags),
    generationTime: Math.round(generationTime * 100) / 100,
    confidence: nlpResult.confidence
  };
}

// Get activities by destination
export function getActivitiesByDestination(destination: string): Activity[] {
  return activities.filter(a => a.destination === destination);
}

// Get hotels by destination
export function getHotelsByDestination(destination: string): Hotel[] {
  return hotels.filter(h => h.destination === destination);
}

// Get restaurants by destination
export function getRestaurantsByDestination(destination: string): Restaurant[] {
  return restaurants.filter(r => r.destination === destination);
}
