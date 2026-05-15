/**
 * API-Based Destination Fetcher
 * Uses external APIs to fetch real destination data
 *
 * Usage: node scripts/fetchDestinations.js [city]
 *   node scripts/fetchDestinations.js Paris
 *   node scripts/fetchDestinations.js all
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');

// External API configuration
const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY;
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// Fallback destination list (free, no API needed)
const FALLBACK_DESTINATIONS = [
  // India
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873, categories: ['heritage', 'culture'] },
  { name: 'Agra', country: 'India', lat: 27.1767, lng: 78.0081, categories: ['heritage', 'historical'] },
  { name: 'Udaipur', country: 'India', lat: 24.5887, lng: 73.7034, categories: ['lake', 'heritage'] },
  { name: 'Varanasi', country: 'India', lat: 25.3176, lng: 83.0068, categories: ['spiritual', 'heritage'] },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, categories: ['culture', 'urban'] },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, categories: ['culture', 'beach'] },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, categories: ['urban', 'tech'] },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867, categories: ['heritage', 'food'] },
  { name: 'Ahmedabad', country: 'India', lat: 23.0225, lng: 72.5714, categories: ['heritage', 'culture'] },
  { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567, categories: ['culture', 'education'] },
  { name: 'Mysore', country: 'India', lat: 12.2958, lng: 76.6394, categories: ['heritage', 'palace'] },
  { name: 'Ooty', country: 'India', lat: 11.4102, lng: 76.6950, categories: ['nature', 'mountain'] },
  { name: 'Shimla', country: 'India', lat: 31.1048, lng: 77.1734, categories: ['mountain', 'heritage'] },
  { name: 'Manali', country: 'India', lat: 32.2397, lng: 77.1887, categories: ['mountain', 'adventure'] },
  { name: 'Rishikesh', country: 'India', lat: 30.0868, lng: 78.2676, categories: ['adventure', 'spiritual'] },
  { name: 'Leh', country: 'India', lat: 34.1466, lng: 77.5779, categories: ['mountain', 'adventure'] },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240, categories: ['beach', 'nightlife'] },
  { name: 'Kerala', country: 'India', lat: 10.8505, lng: 76.2711, categories: ['backwaters', 'beach'] },
  { name: 'Andaman', country: 'India', lat: 11.7401, lng: 92.6586, categories: ['beach', 'island'] },

  // Asia
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, categories: ['urban', 'culture'] },
  { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853, categories: ['culture', 'nature'] },
  { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923, categories: ['beach', 'island'] },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.0920, categories: ['beach', 'spiritual'] },
  { name: 'Yogyakarta', country: 'Indonesia', lat: -7.7956, lng: 110.3696, categories: ['heritage', 'culture'] },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, categories: ['urban', 'food'] },
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, categories: ['urban', 'culture'] },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, categories: ['heritage', 'culture'] },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, categories: ['urban', 'culture'] },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, categories: ['urban', 'food'] },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, categories: ['culture', 'food'] },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, categories: ['urban', 'food'] },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, categories: ['urban', 'food'] },
  { name: 'Penang', country: 'Malaysia', lat: 5.4164, lng: 100.3326, categories: ['heritage', 'food'] },

  // Europe
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, categories: ['culture', 'romance'] },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, categories: ['heritage', 'culture'] },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, categories: ['beach', 'culture'] },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, categories: ['culture', 'bike'] },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, categories: ['heritage', 'culture'] },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, categories: ['culture', 'music'] },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, categories: ['urban', 'art'] },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, categories: ['urban', 'culture'] },
  { name: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883, categories: ['heritage', 'culture'] },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, categories: ['beach', 'culture'] },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, categories: ['heritage', 'beach'] },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, categories: ['heritage', 'culture'] },

  // Americas
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, categories: ['urban', 'culture'] },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, categories: ['beach', 'entertainment'] },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, categories: ['urban', 'culture'] },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, categories: ['beach', 'nightlife'] },
  { name: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, categories: ['entertainment', 'nightlife'] },
  { name: 'Cancun', country: 'Mexico', lat: 21.1619, lng: -86.8515, categories: ['beach', 'ruins'] },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, categories: ['culture', 'tango'] },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, categories: ['beach', 'culture'] },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, categories: ['food', 'history'] },
  { name: 'Cusco', country: 'Peru', lat: -13.5319, lng: -71.9675, categories: ['heritage', 'adventure'] },

  // Middle East & Africa
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, categories: ['luxury', 'shopping'] },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, categories: ['heritage', 'culture'] },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, categories: ['nature', 'beach'] },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, categories: ['heritage', 'history'] }
];

// Free API: OpenStreetMap Nominatim for geocoding
async function geocodeCity(city) {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: { q: city, format: 'json', limit: 1 },
      headers: { 'User-Agent': 'AuraTravel/1.0' },
      timeout: 5000
    });
    if (response.data.length > 0) {
      return {
        lat: parseFloat(response.data[0].lat),
        lng: parseFloat(response.data[0].lon),
        display: response.data[0].display_name
      };
    }
  } catch (e) {
    console.log(`   ⚠️  Geocoding failed for ${city}: ${e.message}`);
  }
  return null;
}

// Free API: Wikipedia for destination info
async function getDestinationInfo(destination) {
  try {
    const response = await axios.get('https://en.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(destination.name), {
      timeout: 5000
    });
    if (response.data) {
      return {
        description: response.data.extract || '',
        image: response.data.thumbnail?.source,
        url: response.data.content_urls?.mobile?.page
      };
    }
  } catch (e) {
    // Silent fail - use defaults
  }
  return { description: '', image: null, url: null };
}

// Google Places API for activities (if API key available)
async function fetchGooglePlaces(destination, type = 'tourist_attraction') {
  if (!GOOGLE_PLACES_API_KEY) {
    return null; // Skip if no API key
  }

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
      params: {
        query: `things to do in ${destination.name}, ${destination.country}`,
        type,
        key: GOOGLE_PLACES_API_KEY
      },
      timeout: 10000
    });

    if (response.data.results) {
      return response.data.results.slice(0, 10).map(place => ({
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        types: place.types,
        location: place.geometry?.location
      }));
    }
  } catch (e) {
    console.log(`   ⚠️  Google Places failed: ${e.message}`);
  }
  return null;
}

// Generate activities from destination categories
function generateActivities(destination, existingCount = 0) {
  const templates = {
    heritage: [
      { name: 'Historical Fort Tour', desc: 'Explore the ancient fort with guided tour', duration: 3, cost: 500 },
      { name: 'Palace Museum Visit', desc: 'Discover royal artifacts and architecture', duration: 2, cost: 400 },
      { name: 'Ancient Temple Visit', desc: 'Experience spiritual heritage', duration: 1, cost: 100 },
      { name: 'Heritage Walking Tour', desc: 'Stroll through historic streets', duration: 2, cost: 300 },
      { name: 'Archaeological Site Tour', desc: 'Explore ancient ruins', duration: 3, cost: 600 }
    ],
    beach: [
      { name: 'Beach Sunrise Walk', desc: 'Start day with peaceful beach walk', duration: 1, cost: 0 },
      { name: 'Water Sports Adventure', desc: 'Jet skiing, parasailing, banana ride', duration: 2, cost: 1500 },
      { name: 'Sunset Boat Cruise', desc: 'Romantic evening cruise', duration: 2, cost: 2000 },
      { name: 'Snorkeling Trip', desc: 'Explore underwater life', duration: 3, cost: 1200 },
      { name: 'Beach Relaxation', desc: 'Sunbathe and swim', duration: 4, cost: 0 }
    ],
    nature: [
      { name: 'Mountain Trek', desc: 'Scenic trail hike', duration: 5, cost: 800 },
      { name: 'Waterfall Visit', desc: 'Swim in natural pools', duration: 3, cost: 200 },
      { name: 'Wildlife Safari', desc: 'Spot local wildlife', duration: 4, cost: 1500 },
      { name: 'Botanical Garden Tour', desc: 'Explore exotic plants', duration: 2, cost: 300 },
      { name: 'Bird Watching', desc: 'Spot native birds', duration: 2, cost: 400 }
    ],
    adventure: [
      { name: 'River Rafting', desc: 'Thrilling white water experience', duration: 3, cost: 1800 },
      { name: 'Rock Climbing', desc: 'Scale natural rock formations', duration: 4, cost: 1200 },
      { name: 'Camping Night', desc: 'Overnight camp with bonfire', duration: 8, cost: 600 },
      { name: 'Zip Lining', desc: 'Aerial canopy tour', duration: 2, cost: 1000 },
      { name: 'Trek to Summit', desc: 'Mountain peak expedition', duration: 6, cost: 1000 }
    ],
    spiritual: [
      { name: 'Morning Yoga Session', desc: 'Riverside yoga class', duration: 2, cost: 400 },
      { name: 'Temple Meditation', desc: 'Guided meditation in ancient temple', duration: 2, cost: 300 },
      { name: 'Spiritual Tour', desc: 'Visit sacred sites', duration: 3, cost: 500 },
      { name: 'Ganga Aarti Experience', desc: 'Evening ritual ceremony', duration: 1, cost: 0 },
      { name: 'Ashram Stay', desc: 'Experience monastic life', duration: 4, cost: 800 }
    ],
    urban: [
      { name: 'Street Food Tour', desc: 'Taste local delicacies', duration: 3, cost: 500 },
      { name: 'Market Shopping', desc: 'Explore local markets', duration: 3, cost: 0 },
      { name: 'Skyline Viewpoint', desc: 'Panoramic city views', duration: 2, cost: 0 },
      { name: 'Art Gallery Visit', desc: 'Contemporary art experience', duration: 2, cost: 400 },
      { name: 'Local Performance', desc: 'Traditional dance/music show', duration: 2, cost: 800 }
    ],
    culture: [
      { name: 'Traditional Dance Show', desc: 'Folk dance performance', duration: 2, cost: 600 },
      { name: 'Cooking Class', desc: 'Learn local cuisine', duration: 3, cost: 1000 },
      { name: 'Craft Workshop', desc: 'Try traditional crafts', duration: 2, cost: 500 },
      { name: 'Cultural Museum', desc: 'Immersive history exhibit', duration: 2, cost: 300 },
      { name: 'Festival Visit', desc: 'Experience local celebration', duration: 4, cost: 0 }
    ],
    mountain: [
      { name: 'Peak Sunrise Trek', desc: 'Hike to viewpoint for sunrise', duration: 5, cost: 600 },
      { name: 'Valley Walk', desc: 'Scenic valley exploration', duration: 3, cost: 300 },
      { name: 'Tea Plantation Tour', desc: 'Learn tea making process', duration: 2, cost: 400 },
      { name: 'Cable Car Ride', desc: 'Aerial mountain views', duration: 1, cost: 800 },
      { name: 'Mountain Monastery', desc: 'Visit hilltop temple', duration: 2, cost: 100 }
    ]
  };

  const activities = [];
  for (const category of destination.categories || ['heritage']) {
    const categoryTemplates = templates[category] || templates.heritage;
    for (const template of categoryTemplates) {
      if (activities.length >= 12) break;
      activities.push({
        id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`,
        name: `${destination.name} ${template.name}`,
        destination: destination.name,
        category,
        description: template.desc,
        experiential_tags: [category, destination.country.toLowerCase()],
        duration_hours: template.duration,
        cost_inr: template.cost + Math.floor(Math.random() * 200),
        opening_hours: { weekday: '09:00-18:00', weekend: '09:00-20:00' },
        location: {
          lat: destination.lat + (Math.random() - 0.5) * 0.1,
          lng: destination.lng + (Math.random() - 0.5) * 0.1,
          address: `${destination.name}, ${destination.country}`
        },
        images: [`https://source.unsplash.com/800x600/?${category},travel`],
        user_rating: 3.5 + Math.random() * 1.5,
        accessibility: 'easy-access',
        best_time: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)]
      });
    }
  }
  return activities;
}

function generateHotels(destination) {
  const templates = [
    { prefix: 'Grand', stars: 5, price: 12000, tags: ['luxury', 'premium'] },
    { prefix: 'Heritage', stars: 4, price: 6000, tags: ['heritage', 'romantic'] },
    { prefix: 'Comfort', stars: 4, price: 4000, tags: ['comfortable', 'family'] },
    { prefix: 'Standard', stars: 3, price: 2500, tags: ['budget', 'clean'] },
    { prefix: 'Value', stars: 3, price: 1800, tags: ['budget', 'friendly'] },
    { prefix: 'Express', stars: 2, price: 1200, tags: ['transit', 'quick'] },
    { prefix: 'Budget', stars: 2, price: 800, tags: ['budget', 'basic'] }
  ];

  return templates.map((t, i) => ({
    id: `hotel-${Date.now()}-${i}`,
    name: `${t.prefix} ${destination.name} Hotel`,
    destination: destination.name,
    description: `${t.stars}-star accommodation with ${t.tags.join(', ')} amenities.`,
    experiential_tags: t.tags,
    star_rating: t.stars,
    price_per_night: t.price + Math.floor(Math.random() * 2000),
    amenities: ['WiFi', 'Restaurant', 'Parking', 'Room Service', 'AC'].slice(0, 4 + Math.floor(Math.random() * 3)),
    location: {
      lat: destination.lat + (Math.random() - 0.5) * 0.05,
      lng: destination.lng + (Math.random() - 0.5) * 0.05,
      address: `City Center, ${destination.name}`
    },
    images: [`https://source.unsplash.com/800x600/?hotel,${destination.name}`],
    user_rating: 3.5 + Math.random() * 1.5
  }));
}

function generateRestaurants(destination) {
  const templates = [
    { name: 'Heritage Dining', cuisine: ['Local', 'Traditional'], price: 1200, tags: ['romantic', 'evening'] },
    { name: 'Street Kitchen', cuisine: ['Local', 'Street Food'], price: 400, tags: ['budget', 'authentic'] },
    { name: 'Rooftop View', cuisine: ['International', 'Fusion'], price: 1500, tags: ['evening', 'view'] },
    { name: 'Spice Garden', cuisine: ['Regional', 'Spicy'], price: 800, tags: ['food', 'spicy'] },
    { name: 'Garden Restaurant', cuisine: ['Continental', 'Healthy'], price: 1000, tags: ['family', 'healthy'] },
    { name: 'Café Central', cuisine: ['Café', 'Quick'], price: 500, tags: ['quick', 'casual'] }
  ];

  return templates.map((t, i) => ({
    id: `rest-${Date.now()}-${i}`,
    name: `${t.name} - ${destination.name}`,
    destination: destination.name,
    description: `Popular ${t.cuisine.join(' & ')} restaurant in ${destination.name}.`,
    cuisine: t.cuisine,
    experiential_tags: t.tags,
    price_range: t.price > 1000 ? '₹₹₹' : t.price > 500 ? '₹₹' : '₹',
    avg_cost_per_person: t.price + Math.floor(Math.random() * 300),
    location: {
      lat: destination.lat + (Math.random() - 0.5) * 0.03,
      lng: destination.lng + (Math.random() - 0.5) * 0.03,
      address: `Food District, ${destination.name}`
    },
    images: [`https://source.unsplash.com/800x600/?restaurant,food`],
    user_rating: 3.8 + Math.random() * 1.2,
    best_for: t.tags[0]
  }));
}

async function fetchDestination(destination) {
  console.log(`📍 Fetching ${destination.name}...`);

  // Check if already exists
  const existing = await Activity.countDocuments({ destination: destination.name });
  if (existing > 5) {
    console.log(`   ⏭️  Skipping (${existing} activities exist)`);
    return { skipped: true };
  }

  // Get Wikipedia info (free API)
  const wikiInfo = await getDestinationInfo(destination);

  // Try Google Places for activities (if API key available)
  let googlePlaces = null;
  if (GOOGLE_PLACES_API_KEY) {
    googlePlaces = await fetchGooglePlaces(destination);
    if (googlePlaces && googlePlaces.length > 0) {
      console.log(`   ✅ Got ${googlePlaces.length} places from Google`);
    }
  }

  // Generate activities from templates + Google data
  let activities = generateActivities(destination);

  // Add Google places as activities if available
  if (googlePlaces && googlePlaces.length > 0) {
    const googleActivities = googlePlaces.slice(0, 5).map((p, i) => ({
      id: `act-g-${Date.now()}-${i}`,
      name: p.name,
      destination: destination.name,
      category: 'attraction',
      description: `Popular attraction in ${destination.name}.`,
      experiential_tags: p.types?.slice(0, 3) || ['attraction'],
      duration_hours: 2,
      cost_inr: 0,
      opening_hours: { weekday: '09:00-18:00', weekend: '09:00-20:00' },
      location: {
        lat: p.location?.lat || destination.lat,
        lng: p.location?.lng || destination.lng,
        address: p.address || destination.name
      },
      images: [`https://source.unsplash.com/800x600/?${destination.name}`],
      user_rating: p.rating || 4.0,
      accessibility: 'easy-access',
      best_time: 'anytime'
    }));
    activities = [...activities, ...googleActivities];
  }

  // Generate hotels and restaurants
  const hotels = generateHotels(destination);
  const restaurants = generateRestaurants(destination);

  // Save to database
  await Activity.insertMany(activities);
  await Hotel.insertMany(hotels);
  await Restaurant.insertMany(restaurants);

  return {
    activities: activities.length,
    hotels: hotels.length,
    restaurants: restaurants.length
  };
}

async function main() {
  const targetCity = process.argv[2];

  console.log('🚀 API-Based Destination Fetcher\n');
  console.log(`   Google Places API: ${GOOGLE_PLACES_API_KEY ? '✅ Configured' : '❌ Not configured (using templates)'}`);
  console.log('');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auratravel';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  let results = { total: 0, skipped: 0 };

  if (targetCity && targetCity !== 'all') {
    // Fetch single city
    const dest = FALLBACK_DESTINATIONS.find(d => d.name.toLowerCase() === targetCity.toLowerCase());
    if (dest) {
      const result = await fetchDestination(dest);
      if (!result.skipped) {
        results.total++;
        console.log(`   ✅ Added: ${result.activities} activities, ${result.hotels} hotels, ${result.restaurants} restaurants`);
      }
    } else {
      // Try geocoding unknown city
      console.log(`   🔍 Unknown city "${targetCity}", attempting geocoding...`);
      const geo = await geocodeCity(targetCity);
      if (geo) {
        const dest = { name: targetCity, country: 'Unknown', lat: geo.lat, lng: geo.lng, categories: ['heritage'] };
        const result = await fetchDestination(dest);
        results.total++;
      } else {
        console.log('   ❌ Could not find city');
      }
    }
  } else {
    // Fetch all destinations
    console.log(`📍 Fetching ${FALLBACK_DESTINATIONS.length} destinations...\n`);

    for (const dest of FALLBACK_DESTINATIONS) {
      const result = await fetchDestination(dest);
      if (!result.skipped) {
        results.total++;
        console.log(`   ✅ Added: ${result.activities} activities, ${result.hotels} hotels, ${result.restaurants} restaurants`);
      } else {
        results.skipped++;
      }

      // Rate limit to be respectful to free APIs
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // Summary
  const counts = await Promise.all([
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments()
  ]);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 SUMMARY:');
  console.log(`   Fetched: ${results.total} new destinations`);
  console.log(`   Skipped: ${results.skipped} (already existed)`);
  console.log(`   Activities: ${counts[0]}`);
  console.log(`   Hotels: ${counts[1]}`);
  console.log(`   Restaurants: ${counts[2]}`);
  console.log(`   TOTAL: ${counts[0] + counts[1] + counts[2]}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  console.log('✅ Done!');
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});