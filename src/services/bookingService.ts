import { Flight, getFlightsByRoute } from '@/data/flights';
import { Hotel, hotels } from '@/data/hotels';
import { apiRequest } from './apiClient';

// Booking types
export interface FlightBooking {
  flight: Flight;
  passengers: number;
  travelDate: string;
  totalPrice: number;
}

export interface HotelBooking {
  hotel: Hotel;
  checkIn: string;
  checkOut: string;
  nights: number;
  rooms: number;
  guests: number;
  totalPrice: number;
}

export interface TripBooking {
  id: string;
  createdAt: Date;
  destination: string;
  flightBooking: FlightBooking | null;
  hotelBooking: HotelBooking | null;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  paymentMethod: string;
  contactDetails: {
    name: string;
    email: string;
    phone: string;
  };
}

// Search flights
export interface FlightSearchParams {
  origin: string;
  destination: string;
  date: string;
  passengers: number;
}

export async function searchFlights(params: FlightSearchParams): Promise<Flight[]> {
  try {
    const search = new URLSearchParams({
      origin: params.origin,
      destination: params.destination,
      date: params.date,
      passengers: String(params.passengers)
    });
    const response = await apiRequest<{ success: boolean; flights: Flight[] }>(`/flights?${search.toString()}`);
    return response.flights;
  } catch (error) {
    console.warn('Using local flight fallback:', error);
    return getFlightsByRoute(params.origin, params.destination).sort((a, b) => a.price - b.price);
  }
}

// Search hotels
export interface HotelSearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

export async function searchHotels(params: HotelSearchParams): Promise<Hotel[]> {
  try {
    const search = new URLSearchParams({
      destination: params.destination,
      checkin: params.checkIn,
      checkout: params.checkOut,
      guests: String(params.guests),
      rooms: String(params.rooms)
    });
    const response = await apiRequest<{ success: boolean; hotels: Hotel[] }>(`/hotels?${search.toString()}`);
    return response.hotels;
  } catch (error) {
    console.warn('Using local hotel fallback:', error);
    return hotels
      .filter(h => h.destination.toLowerCase() === params.destination.toLowerCase())
      .sort((a, b) => b.user_rating - a.user_rating);
  }
}

// Calculate number of nights
export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Create flight booking
export function createFlightBooking(
  flight: Flight,
  passengers: number,
  travelDate: string
): FlightBooking {
  return {
    flight,
    passengers,
    travelDate,
    totalPrice: flight.price * passengers
  };
}

// Create hotel booking
export function createHotelBooking(
  hotel: Hotel,
  checkIn: string,
  checkOut: string,
  rooms: number,
  guests: number
): HotelBooking {
  const nights = calculateNights(checkIn, checkOut);
  return {
    hotel,
    checkIn,
    checkOut,
    nights,
    rooms,
    guests,
    totalPrice: hotel.price_per_night * nights * rooms
  };
}

// Generate booking ID
function generateBookingId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AURA-${randomStr}-${timestamp}`;
}

// Create complete trip booking
export function createTripBooking(
  destination: string,
  flightBooking: FlightBooking | null,
  hotelBooking: HotelBooking | null,
  contactDetails: { name: string; email: string; phone: string },
  paymentMethod: string
): TripBooking {
  const flightCost = flightBooking?.totalPrice || 0;
  const hotelCost = hotelBooking?.totalPrice || 0;
  
  return {
    id: generateBookingId(),
    createdAt: new Date(),
    destination,
    flightBooking,
    hotelBooking,
    totalCost: flightCost + hotelCost,
    status: 'confirmed',
    paymentMethod,
    contactDetails
  };
}

// Store booking in localStorage (mock persistence)
export async function saveBooking(booking: TripBooking): Promise<TripBooking> {
  try {
    const response = await apiRequest<{ success: boolean; booking_confirmation: TripBooking }>('/bookings/confirm', {
      method: 'POST',
      body: JSON.stringify({
        destination: booking.destination,
        flightBooking: booking.flightBooking,
        hotelBooking: booking.hotelBooking,
        totalCost: booking.totalCost,
        paymentMethod: booking.paymentMethod,
        contactDetails: booking.contactDetails
      })
    });
    booking = response.booking_confirmation;
  } catch (error) {
    console.warn('Saving booking locally only:', error);
  }

  const existingBookings = getBookings();
  existingBookings.push(booking);
  localStorage.setItem('aura_bookings', JSON.stringify(existingBookings));
  return booking;
}

// Get all bookings from localStorage
export function getBookings(): TripBooking[] {
  const stored = localStorage.getItem('aura_bookings');
  if (!stored) return [];
  
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

// Get booking by ID
export function getBookingById(id: string): TripBooking | null {
  const bookings = getBookings();
  return bookings.find(b => b.id === id) || null;
}

// Cancel booking
export function cancelBooking(id: string): boolean {
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  
  if (index === -1) return false;
  
  bookings[index].status = 'cancelled';
  localStorage.setItem('aura_bookings', JSON.stringify(bookings));
  return true;
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time for display
export function formatTime(time: string): string {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;
  return `${displayHour}:${minutes} ${ampm}`;
}

// Get price range label
export function getPriceRangeLabel(price: number): string {
  if (price < 3000) return 'Budget';
  if (price < 6000) return 'Value';
  if (price < 10000) return 'Premium';
  return 'Luxury';
}
