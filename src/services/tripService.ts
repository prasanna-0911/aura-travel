import { GeneratedItinerary } from './weaverService';
import { apiRequest } from './apiClient';

export interface StartedTripResponse {
  success: boolean;
  trip_id: string;
  trip: unknown;
}

export async function startTrip(itinerary: GeneratedItinerary) {
  localStorage.setItem('aura_current_itinerary', JSON.stringify(itinerary));

  try {
    return await apiRequest<StartedTripResponse>('/trips/start', {
      method: 'POST',
      body: JSON.stringify({ itinerary })
    });
  } catch (error) {
    console.warn('Trip saved locally; backend start-trip failed:', error);
    return null;
  }
}
