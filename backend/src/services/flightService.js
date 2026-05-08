const AIRLINES = [
  { name: 'IndiGo', code: '6E', logo: '6E' },
  { name: 'Air India', code: 'AI', logo: 'AI' },
  { name: 'SpiceJet', code: 'SG', logo: 'SG' },
  { name: 'Vistara', code: 'UK', logo: 'UK' },
  { name: 'Akasa Air', code: 'QP', logo: 'QP' }
];

const ROUTES = [
  ['Pune', 'PNQ', 'Pune International Airport', 'Goa', 'GOI', 'Dabolim Airport', 4500, '1h 15m'],
  ['Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Goa', 'GOI', 'Dabolim Airport', 3500, '1h 05m'],
  ['Delhi', 'DEL', 'Indira Gandhi Intl', 'Goa', 'GOI', 'Dabolim Airport', 5500, '2h 25m'],
  ['Bangalore', 'BLR', 'Kempegowda Intl', 'Goa', 'GOI', 'Dabolim Airport', 4000, '1h 20m'],
  ['Delhi', 'DEL', 'Indira Gandhi Intl', 'Kullu', 'KUU', 'Bhuntar Airport', 6500, '1h 30m'],
  ['Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Kullu', 'KUU', 'Bhuntar Airport', 8000, '2h 15m'],
  ['Delhi', 'DEL', 'Indira Gandhi Intl', 'Pune', 'PNQ', 'Pune International Airport', 5000, '2h 00m'],
  ['Mumbai', 'BOM', 'Chhatrapati Shivaji Intl', 'Pune', 'PNQ', 'Pune International Airport', 3000, '0h 45m'],
  ['Bangalore', 'BLR', 'Kempegowda Intl', 'Pune', 'PNQ', 'Pune International Airport', 4500, '1h 30m']
];

const DEPARTURE_TIMES = ['06:00', '08:30', '10:15', '12:45', '14:30', '16:00', '18:30', '20:45'];

function parseDuration(duration) {
  const [hoursPart, minsPart = '0m'] = duration.split('h');
  return parseInt(hoursPart, 10) * 60 + parseInt(minsPart.replace('m', '').trim() || '0', 10);
}

function addMinutes(time, minutes) {
  const [hours, mins] = time.split(':').map(Number);
  const total = hours * 60 + mins + minutes;
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}

function generateFlightsForRoute(route) {
  const [originCity, originCode, originAirport, destCity, destCode, destAirport, basePrice, duration] = route;
  const baseMinutes = parseDuration(duration);

  return DEPARTURE_TIMES.map((departure, index) => {
    const airline = AIRLINES[index % AIRLINES.length];
    const stops = index % 3 === 2 ? 1 : 0;
    const deterministicVariation = ((index * 371 + basePrice) % 1800) - 400;
    const totalMinutes = baseMinutes + stops * 45;

    return {
      id: `${originCode}-${destCode}-${airline.code}-${index}`,
      airline: airline.name,
      airlineCode: airline.code,
      flightNumber: `${airline.code}${100 + index * 11}`,
      origin: { city: originCity, code: originCode, airport: originAirport },
      destination: { city: destCity, code: destCode, airport: destAirport },
      departure,
      arrival: addMinutes(departure, totalMinutes),
      duration: stops ? `${Math.floor(totalMinutes / 60)}h ${totalMinutes % 60}m` : duration,
      price: Math.max(1800, basePrice + deterministicVariation - (stops ? 650 : 0)),
      seatsAvailable: 8 + ((index * 7 + basePrice) % 22),
      class: 'economy',
      stops,
      amenities: ['Meal', 'WiFi', 'Entertainment', 'Power Outlet'].slice(0, 2 + (index % 3)),
      logo: airline.logo
    };
  });
}

const flights = ROUTES.flatMap(generateFlightsForRoute);

function searchFlights({ origin = '', destination = '' }) {
  const originLower = origin.toLowerCase();
  const destLower = destination.toLowerCase();
  const normalizedDestination = destLower.includes('manali') ? 'kullu' : destLower;

  return flights
    .filter((flight) =>
      flight.origin.city.toLowerCase().includes(originLower) &&
      flight.destination.city.toLowerCase().includes(normalizedDestination)
    )
    .sort((a, b) => a.price - b.price);
}

module.exports = { flights, searchFlights };
