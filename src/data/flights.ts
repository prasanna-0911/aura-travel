export interface Flight {
  id: string;
  airline: string;
  airlineCode: string;
  flightNumber: string;
  origin: {
    city: string;
    code: string;
    airport: string;
  };
  destination: {
    city: string;
    code: string;
    airport: string;
  };
  departure: string; // Time in HH:MM format
  arrival: string;
  duration: string;
  price: number;
  seatsAvailable: number;
  class: 'economy' | 'business' | 'first';
  stops: number;
  amenities: string[];
  logo: string;
}

// Airlines data
const AIRLINES = [
  { name: 'IndiGo', code: '6E', logo: '🛫', color: '#0066CC' },
  { name: 'Air India', code: 'AI', logo: '✈️', color: '#E31837' },
  { name: 'SpiceJet', code: 'SG', logo: '🛩️', color: '#FF5722' },
  { name: 'Vistara', code: 'UK', logo: '🛫', color: '#6B2D5B' },
  { name: 'Go First', code: 'G8', logo: '✈️', color: '#00A651' }
];

// Generate flights for routes
function generateFlights(
  originCity: string,
  originCode: string,
  originAirport: string,
  destCity: string,
  destCode: string,
  destAirport: string,
  basePrice: number,
  duration: string
): Flight[] {
  const flights: Flight[] = [];
  const departureTimes = ['06:00', '08:30', '10:15', '12:45', '14:30', '16:00', '18:30', '20:45'];
  
  departureTimes.forEach((departure, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const isNonStop = index % 3 !== 2;
    const stops = isNonStop ? 0 : 1;
    const priceVariation = Math.floor(Math.random() * 2000) - 500;
    const stopPriceReduction = stops > 0 ? -800 : 0;
    
    // Calculate arrival time
    const durationHours = parseInt(duration.split('h')[0]);
    const durationMins = parseInt(duration.split('h ')[1]?.replace('m', '') || '0');
    const totalMins = durationHours * 60 + durationMins + (stops * 45);
    const depMins = parseInt(departure.split(':')[0]) * 60 + parseInt(departure.split(':')[1]);
    const arrMins = depMins + totalMins;
    const arrHours = Math.floor(arrMins / 60) % 24;
    const arrMinutes = arrMins % 60;
    const arrival = `${arrHours.toString().padStart(2, '0')}:${arrMinutes.toString().padStart(2, '0')}`;
    
    const actualDuration = stops > 0 
      ? `${durationHours}h ${durationMins + 45}m` 
      : duration;
    
    flights.push({
      id: `${originCode}-${destCode}-${airline.code}-${index}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${100 + index * 11}`,
      origin: {
        city: originCity,
        code: originCode,
        airport: originAirport
      },
      destination: {
        city: destCity,
        code: destCode,
        airport: destAirport
      },
      departure,
      arrival,
      duration: actualDuration,
      price: basePrice + priceVariation + stopPriceReduction,
      seatsAvailable: Math.floor(Math.random() * 20) + 5,
      class: 'economy',
      stops,
      amenities: ['Meal', 'WiFi', 'Entertainment', 'Power Outlet'].slice(0, 2 + Math.floor(Math.random() * 3)),
      logo: airline.logo
    });
  });
  
  return flights;
}

// Pre-generated flights for common routes
export const flights: Flight[] = [
  // Pune to Goa
  ...generateFlights('Pune', 'PNQ', 'Pune International Airport', 'Goa', 'GOI', 'Dabolim Airport', 4500, '1h 15m'),
  // Mumbai to Goa
  ...generateFlights('Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Goa', 'GOI', 'Dabolim Airport', 3500, '1h 05m'),
  // Delhi to Goa
  ...generateFlights('Delhi', 'DEL', 'Indira Gandhi Intl', 'Goa', 'GOI', 'Dabolim Airport', 5500, '2h 25m'),
  // Bangalore to Goa
  ...generateFlights('Bangalore', 'BLR', 'Kempegowda Intl', 'Goa', 'GOI', 'Dabolim Airport', 4000, '1h 20m'),
  
  // Delhi to Manali (via Chandigarh/Kullu)
  ...generateFlights('Delhi', 'DEL', 'Indira Gandhi Intl', 'Kullu', 'KUU', 'Bhuntar Airport', 6500, '1h 30m'),
  // Mumbai to Manali (via Chandigarh/Kullu)
  ...generateFlights('Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Kullu', 'KUU', 'Bhuntar Airport', 8000, '2h 15m'),
  
  // Flights to Pune
  ...generateFlights('Delhi', 'DEL', 'Indira Gandhi Intl', 'Pune', 'PNQ', 'Pune International Airport', 5000, '2h 00m'),
  ...generateFlights('Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Pune', 'PNQ', 'Pune International Airport', 3000, '0h 45m'),
  ...generateFlights('Bangalore', 'BLR', 'Kempegowda Intl', 'Pune', 'PNQ', 'Pune International Airport', 4500, '1h 30m'),
];

// Get flights by route
export function getFlightsByRoute(origin: string, destination: string): Flight[] {
  const originLower = origin.toLowerCase();
  const destLower = destination.toLowerCase();
  
  return flights.filter(f => 
    f.origin.city.toLowerCase().includes(originLower) &&
    f.destination.city.toLowerCase().includes(destLower)
  );
}

// Get available origin cities
export const ORIGIN_CITIES = [
  { city: 'Delhi', code: 'DEL' },
  { city: 'Mumbai', code: 'BOM' },
  { city: 'Bangalore', code: 'BLR' },
  { city: 'Pune', code: 'PNQ' },
  { city: 'Chennai', code: 'MAA' },
  { city: 'Hyderabad', code: 'HYD' },
  { city: 'Kolkata', code: 'CCU' }
];

// Get available destination cities (our supported destinations)
export const DESTINATION_CITIES = [
  { city: 'Goa', code: 'GOI' },
  { city: 'Kullu (Manali)', code: 'KUU' },
  { city: 'Pune', code: 'PNQ' }
];
