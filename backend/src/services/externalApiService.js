const axios = require('axios');

const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const BOOKING_API_KEY = process.env.BOOKING_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

class ExternalApiService {
  constructor() {
    this.googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place';
    this.bookingBaseUrl = 'https://booking-com.p.rapidapi.com/v1';
  }

  // Google Places Text Search - find places by query
  async searchPlaces(query, type = 'tourist_attraction') {
    if (!GOOGLE_PLACES_API_KEY) {
      return { success: false, error: 'Google Places API key not configured', results: [] };
    }

    try {
      const response = await axios.get(`${this.googlePlacesBaseUrl}/textsearch/json`, {
        params: {
          query,
          type,
          key: GOOGLE_PLACES_API_KEY
        }
      });

      return {
        success: true,
        results: response.data.results?.map(this.formatPlaceResult) || []
      };
    } catch (error) {
      console.error('Google Places search error:', error.message);
      return { success: false, error: error.message, results: [] };
    }
  }

  // Get place details including photos, reviews
  async getPlaceDetails(placeId) {
    if (!GOOGLE_PLACES_API_KEY) {
      return { success: false, error: 'Google Places API key not configured' };
    }

    try {
      const response = await axios.get(`${this.googlePlacesBaseUrl}/details/json`, {
        params: {
          place_id: placeId,
          fields: 'name,formatted_address,geometry,rating,reviews,photos,opening_hours,website,formatted_phone_number,price_level,types',
          key: GOOGLE_PLACES_API_KEY
        }
      });

      return { success: true, place: this.formatPlaceDetails(response.data.result) };
    } catch (error) {
      console.error('Google Places details error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Search hotels in a location
  async searchHotels(destination, checkin, checkout, guests = 2) {
    if (!RAPIDAPI_KEY) {
      return this.getMockHotels(destination);
    }

    try {
      const response = await axios.get(`${this.bookingBaseUrl}/hotels/search`, {
        params: {
          dest_id: destination,
          checkin_date: checkin,
          checkout_date: checkout,
          guest_qty: guests,
          currency: 'INR'
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'booking-com.p.rapidapi.com'
        }
      });

      return {
        success: true,
        hotels: response.data.result?.map(this.formatHotelResult) || []
      };
    } catch (error) {
      console.error('Hotel search error:', error.message);
      return this.getMockHotels(destination);
    }
  }

  // Search flights
  async searchFlights(origin, destination, date, passengers = 1) {
    if (!RAPIDAPI_KEY) {
      return this.getMockFlights(origin, destination, date);
    }

    try {
      const response = await axios.get('https://skyscanner-api.p.rapidapi.com/v3a/flights/live/search', {
        params: {
          origin,
          destination,
          date,
          passengers,
          currency: 'INR'
        },
        headers: {
          'X-RapidAPI-Key': RAPIDAPI_KEY,
          'X-RapidAPI-Host': 'skyscanner-api.p.rapidapi.com'
        }
      });

      return {
        success: true,
        flights: response.data.flights?.map(this.formatFlightResult) || []
      };
    } catch (error) {
      console.error('Flight search error:', error.message);
      return this.getMockFlights(origin, destination, date);
    }
  }

  // Search restaurants
  async searchRestaurants(location, type = 'restaurant') {
    const query = `${type} in ${location}`;
    return this.searchPlaces(query, 'restaurant');
  }

  // Search activities/things to do
  async searchActivities(destination) {
    const query = `things to do in ${destination}`;
    return this.searchPlaces(query, 'tourist_attraction');
  }

  // Format Google Places search results
  formatPlaceResult(place) {
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      userRatingsTotal: place.user_ratings_total,
      priceLevel: place.price_level,
      types: place.types,
      location: place.geometry?.location,
      photos: place.photos?.slice(0, 3).map(p => ({
        photoReference: p.photo_reference,
        width: p.width,
        height: p.height
      }))
    };
  }

  // Format place details
  formatPlaceDetails(place) {
    return {
      name: place.name,
      address: place.formatted_address,
      rating: place.rating,
      reviews: place.reviews?.slice(0, 5).map(r => ({
        author: r.author_name,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description
      })),
      photos: place.photos?.slice(0, 10).map(p => ({
        reference: p.photo_reference,
        url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${p.photo_reference}&key=${GOOGLE_PLACES_API_KEY}`
      })),
      openingHours: place.opening_hours?.weekday_text,
      website: place.website,
      phone: place.formatted_phone_number,
      priceLevel: place.price_level,
      types: place.types
    };
  }

  // Format hotel result
  formatHotelResult(hotel) {
    return {
      id: hotel.hotel_id,
      name: hotel.property_name,
      rating: hotel.class,
      reviewScore: hotel.review_score,
      reviewCount: hotel.review_total,
      address: hotel.address,
      distance: hotel.distance,
      price: hotel.price_breakdown?.total_price?.value,
      currency: hotel.price_breakdown?.total_price?.currency || 'INR',
      amenities: hotel.applied_filters?.amenities || [],
      photos: hotel.photos?.slice(0, 5)
    };
  }

  // Format flight result
  formatFlightResult(flight) {
    return {
      id: flight.flight_id,
      airline: flight.carriers?.[0]?.name,
      departure: {
        airport: flight.legs?.[0]?.departure_airport,
        time: flight.legs?.[0]?.departure_time
      },
      arrival: {
        airport: flight.legs?.[0]?.arrival_airport,
        time: flight.legs?.[0]?.arrival_time
      },
      price: flight.prices?.[0]?.price,
      currency: flight.prices?.[0]?.currency || 'INR'
    };
  }

  // Fallback mock data when API keys not available
  getMockHotels(destination) {
    return {
      success: true,
      source: 'mock',
      hotels: [
        { id: 'mock-1', name: `Grand ${destination} Hotel`, rating: 4, reviewScore: 8.5, price: 4500 },
        { id: 'mock-2', name: `Sea View Resort`, rating: 4, reviewScore: 8.2, price: 3800 },
        { id: 'mock-3', name: `City Center Inn`, rating: 3, reviewScore: 7.8, price: 2200 }
      ]
    };
  }

  getMockFlights(origin, destination, date) {
    return {
      success: true,
      source: 'mock',
      flights: [
        { id: 'mock-f1', airline: 'Air India', price: 8500 },
        { id: 'mock-f2', airline: 'IndiGo', price: 7200 },
        { id: 'mock-f3', airline: 'SpiceJet', price: 6800 }
      ]
    };
  }
}

module.exports = new ExternalApiService();