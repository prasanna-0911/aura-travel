export { activities, ACTIVITY_TEMPLATE, type Activity } from './activities';
export { hotels, HOTEL_TEMPLATE, type Hotel } from './hotels';
export { restaurants, RESTAURANT_TEMPLATE, type Restaurant } from './restaurants';
export { flights, getFlightsByRoute, ORIGIN_CITIES, DESTINATION_CITIES, type Flight } from './flights';

// Quick stats
import { activities } from './activities';
import { hotels } from './hotels';
import { restaurants } from './restaurants';

export const DATA_STATS = {
  totalActivities: activities.length,
  totalHotels: hotels.length,
  totalRestaurants: restaurants.length,
  totalEntities: activities.length + hotels.length + restaurants.length,
  destinations: ['Goa', 'Manali', 'Pune'],
  activitiesByDestination: {
    Goa: activities.filter(a => a.destination === 'Goa').length,
    Manali: activities.filter(a => a.destination === 'Manali').length,
    Pune: activities.filter(a => a.destination === 'Pune').length,
  }
};
