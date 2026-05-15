/**
 * Free Destination Expander - Zero Budget Solution
 *
 * Uses ONLY free APIs:
 * - OpenStreetMap (Nominatim for geocoding)
 * - Wikipedia (destination info)
 * - Static templates (fallback)
 *
 * Usage: node scripts/expandDestinations.js [count]
 */

require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');

// Comprehensive free destination list
const DESTINATIONS = [
  // India - Major Cities
  { name: 'Delhi', country: 'India', lat: 28.6139, lng: 77.2090, categories: ['heritage', 'urban', 'food'] },
  { name: 'Mumbai', country: 'India', lat: 19.0760, lng: 72.8777, categories: ['urban', 'beach', 'entertainment'] },
  { name: 'Bangalore', country: 'India', lat: 12.9716, lng: 77.5946, categories: ['urban', 'tech', 'food'] },
  { name: 'Chennai', country: 'India', lat: 13.0827, lng: 80.2707, categories: ['culture', 'beach', 'food'] },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, categories: ['culture', 'heritage', 'food'] },
  { name: 'Hyderabad', country: 'India', lat: 17.3850, lng: 78.4867, categories: ['heritage', 'food', 'culture'] },
  { name: 'Pune', country: 'India', lat: 18.5204, lng: 73.8567, categories: ['education', 'culture', 'nature'] },

  // India - Tourist
  { name: 'Agra', country: 'India', lat: 27.1767, lng: 78.0081, categories: ['heritage', 'historical'] },
  { name: 'Jaipur', country: 'India', lat: 26.9124, lng: 75.7873, categories: ['heritage', 'culture'] },
  { name: 'Varanasi', country: 'India', lat: 25.3176, lng: 83.0068, categories: ['spiritual', 'heritage'] },
  { name: 'Udaipur', country: 'India', lat: 24.5854, lng: 73.7125, categories: ['lake', 'heritage'] },
  { name: 'Goa', country: 'India', lat: 15.2993, lng: 74.1240, categories: ['beach', 'party'] },
  { name: 'Shimla', country: 'India', lat: 31.1048, lng: 77.1734, categories: ['mountain', 'heritage'] },
  { name: 'Manali', country: 'India', lat: 32.2397, lng: 77.1887, categories: ['mountain', 'adventure'] },
  { name: 'Rishikesh', country: 'India', lat: 30.0868, lng: 78.2676, categories: ['adventure', 'spiritual'] },
  { name: 'Leh', country: 'India', lat: 34.1466, lng: 77.5779, categories: ['mountain', 'adventure'] },
  { name: 'Mysore', country: 'India', lat: 12.2958, lng: 76.6394, categories: ['heritage', 'palace'] },
  { name: 'Ooty', country: 'India', lat: 11.4102, lng: 76.6950, categories: ['nature', 'mountain'] },
  { name: 'Kodaikanal', country: 'India', lat: 10.2381, lng: 77.4892, categories: ['nature', 'lake'] },
  { name: 'Munnar', country: 'India', lat: 10.0889, lng: 77.0595, categories: ['nature', 'tea'] },
  { name: 'Coorg', country: 'India', lat: 12.3375, lng: 75.8069, categories: ['nature', 'coffee'] },
  { name: 'Wayanad', country: 'India', lat: 11.6852, lng: 76.1320, categories: ['nature', 'wildlife'] },
  { name: 'Kolkata', country: 'India', lat: 22.5726, lng: 88.3639, categories: ['culture', 'heritage'] },

  // Asia - Major
  { name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, categories: ['urban', 'culture'] },
  { name: 'Kyoto', country: 'Japan', lat: 35.0116, lng: 135.7681, categories: ['heritage', 'temple'] },
  { name: 'Bangkok', country: 'Thailand', lat: 13.7563, lng: 100.5018, categories: ['urban', 'culture'] },
  { name: 'Chiang Mai', country: 'Thailand', lat: 18.7883, lng: 98.9853, categories: ['culture', 'nature'] },
  { name: 'Bali', country: 'Indonesia', lat: -8.3405, lng: 115.0920, categories: ['beach', 'spiritual'] },
  { name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, categories: ['urban', 'food'] },
  { name: 'Hong Kong', country: 'Hong Kong', lat: 22.3193, lng: 114.1694, categories: ['urban', 'food'] },
  { name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.9780, categories: ['urban', 'culture'] },
  { name: 'Hanoi', country: 'Vietnam', lat: 21.0278, lng: 105.8342, categories: ['culture', 'food'] },
  { name: 'Ho Chi Minh City', country: 'Vietnam', lat: 10.8231, lng: 106.6297, categories: ['urban', 'food'] },
  { name: 'Kuala Lumpur', country: 'Malaysia', lat: 3.1390, lng: 101.6869, categories: ['urban', 'food'] },
  { name: 'Phuket', country: 'Thailand', lat: 7.8804, lng: 98.3923, categories: ['beach', 'island'] },

  // Europe
  { name: 'Paris', country: 'France', lat: 48.8566, lng: 2.3522, categories: ['romance', 'culture'] },
  { name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, categories: ['urban', 'culture'] },
  { name: 'Rome', country: 'Italy', lat: 41.9028, lng: 12.4964, categories: ['heritage', 'culture'] },
  { name: 'Barcelona', country: 'Spain', lat: 41.3851, lng: 2.1734, categories: ['beach', 'culture'] },
  { name: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lng: 4.9041, categories: ['culture', 'cycling'] },
  { name: 'Vienna', country: 'Austria', lat: 48.2082, lng: 16.3738, categories: ['culture', 'music'] },
  { name: 'Prague', country: 'Czech Republic', lat: 50.0755, lng: 14.4378, categories: ['heritage', 'culture'] },
  { name: 'Berlin', country: 'Germany', lat: 52.5200, lng: 13.4050, categories: ['urban', 'art'] },
  { name: 'Lisbon', country: 'Portugal', lat: 38.7223, lng: -9.1393, categories: ['beach', 'culture'] },
  { name: 'Athens', country: 'Greece', lat: 37.9838, lng: 23.7275, categories: ['heritage', 'beach'] },
  { name: 'Edinburgh', country: 'UK', lat: 55.9533, lng: -3.1883, categories: ['heritage', 'culture'] },
  { name: 'Dublin', country: 'Ireland', lat: 53.3498, lng: -6.2603, categories: ['culture', 'pub'] },
  { name: 'Budapest', country: 'Hungary', lat: 47.4979, lng: 19.0402, categories: ['heritage', 'spa'] },
  { name: 'Istanbul', country: 'Turkey', lat: 41.0082, lng: 28.9784, categories: ['heritage', 'culture'] },
  { name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, categories: ['heritage', 'urban'] },

  // Americas
  { name: 'New York', country: 'USA', lat: 40.7128, lng: -74.0060, categories: ['urban', 'entertainment'] },
  { name: 'Los Angeles', country: 'USA', lat: 34.0522, lng: -118.2437, categories: ['beach', 'entertainment'] },
  { name: 'San Francisco', country: 'USA', lat: 37.7749, lng: -122.4194, categories: ['urban', 'culture'] },
  { name: 'Miami', country: 'USA', lat: 25.7617, lng: -80.1918, categories: ['beach', 'nightlife'] },
  { name: 'Las Vegas', country: 'USA', lat: 36.1699, lng: -115.1398, categories: ['entertainment', 'nightlife'] },
  { name: 'Chicago', country: 'USA', lat: 41.8781, lng: -87.6298, categories: ['urban', 'architecture'] },
  { name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, categories: ['urban', 'culture'] },
  { name: 'Vancouver', country: 'Canada', lat: 49.2827, lng: -123.1207, categories: ['nature', 'urban'] },
  { name: 'Mexico City', country: 'Mexico', lat: 19.4326, lng: -99.1332, categories: ['culture', 'food'] },
  { name: 'Cancun', country: 'Mexico', lat: 21.1619, lng: -86.8515, categories: ['beach', 'ruins'] },
  { name: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lng: -43.1729, categories: ['beach', 'culture'] },
  { name: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lng: -58.3816, categories: ['culture', 'tango'] },
  { name: 'Lima', country: 'Peru', lat: -12.0464, lng: -77.0428, categories: ['food', 'history'] },
  { name: 'Cusco', country: 'Peru', lat: -13.5319, lng: -71.9675, categories: ['heritage', 'adventure'] },

  // Middle East & Africa
  { name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, categories: ['luxury', 'shopping'] },
  { name: 'Marrakech', country: 'Morocco', lat: 31.6295, lng: -7.9811, categories: ['heritage', 'culture'] },
  { name: 'Cairo', country: 'Egypt', lat: 30.0444, lng: 31.2357, categories: ['heritage', 'history'] },
  { name: 'Cape Town', country: 'South Africa', lat: -33.9249, lng: 18.4241, categories: ['nature', 'beach'] },
  { name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, categories: ['urban', 'culture'] },
  { name: 'Tel Aviv', country: 'Israel', lat: 32.0853, lng: 34.7818, categories: ['beach', 'culture'] },

  // Oceania
  { name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, categories: ['beach', 'urban'] },
  { name: 'Melbourne', country: 'Australia', lat: -37.8136, lng: 144.9631, categories: ['culture', 'coffee'] },
  { name: 'Brisbane', country: 'Australia', lat: -27.4698, lng: 153.0251, categories: ['nature', 'urban'] },
  { name: 'Auckland', country: 'New Zealand', lat: -36.8485, lng: 174.7633, categories: ['urban', 'nature'] },
  { name: 'Queenstown', country: 'New Zealand', lat: -45.0312, lng: 168.6626, categories: ['adventure', 'lake'] }
];

// Free image placeholders (no API needed)
const IMAGES = {
  heritage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
  beach: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  nature: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  adventure: 'https://images.unsplash.com/photo-1533130061792-64b9e998a58b?w=800',
  spiritual: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
  urban: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800',
  culture: 'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=800',
  mountain: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800'
};

const ACTIVITY_TEMPLATES = {
  heritage: ['Historical Monument Visit', 'Heritage Walking Tour', 'Museum Exploration', 'Ancient Temple Visit', 'Palace Tour'],
  beach: ['Beach Sunrise', 'Swimming', 'Sunset Watching', 'Beach Walk', 'Water Sports'],
  nature: ['Nature Hike', 'Wildlife Safari', 'Bird Watching', 'Botanical Garden', 'Waterfall Visit'],
  adventure: ['Trekking', 'Rock Climbing', 'Camping', 'River Rafting', 'Zip Lining'],
  spiritual: ['Temple Visit', 'Meditation', 'Yoga Session', 'Pilgrimage', 'Spiritual Walk'],
  urban: ['City Tour', 'Street Food', 'Market Shopping', 'Local Experience', 'Night Life'],
  culture: ['Cultural Show', 'Art Gallery', 'Local Festival', 'Craft Workshop', 'Cooking Class'],
  mountain: ['Peak Hike', 'Valley View', 'Cable Car', 'Mountain Temple', 'Tea Plantation']
};

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
}

async function enrichDestination(dest) {
  console.log(`📍 Processing ${dest.name}...`);

  const existing = await Activity.countDocuments({ destination: dest.name });
  if (existing >= 8) {
    console.log(`   ⏭️  Skipping (${existing} activities exist)`);
    return { skipped: true };
  }

  // Try Wikipedia for real description (free API)
  let description = '';
  try {
    const wiki = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(dest.name)}`,
      { timeout: 5000 }
    );
    description = wiki.data?.extract?.substring(0, 200) || '';
  } catch {}

  const activities = [];
  for (const category of dest.categories) {
    const templates = ACTIVITY_TEMPLATES[category] || ACTIVITY_TEMPLATES.heritage;

    for (const template of templates.slice(0, 3)) {
      activities.push({
        id: generateId('act'),
        name: `${dest.name} ${template}`,
        destination: dest.name,
        category,
        description: description ? `${template} in ${dest.name}. ${description}` : `Experience ${template.toLowerCase()} in ${dest.name}.`,
        experiential_tags: [category, dest.country.toLowerCase()],
        duration_hours: 1 + Math.floor(Math.random() * 4),
        cost_inr: Math.floor(Math.random() * 1500),
        opening_hours: { weekday: '09:00-18:00', weekend: '09:00-20:00' },
        location: {
          lat: dest.lat + (Math.random() - 0.5) * 0.05,
          lng: dest.lng + (Math.random() - 0.5) * 0.05,
          address: `${dest.name}, ${dest.country}`
        },
        images: [IMAGES[category] || IMAGES.heritage],
        user_rating: 3.5 + Math.random() * 1.5,
        accessibility: 'easy-access',
        best_time: ['morning', 'afternoon', 'evening'][Math.floor(Math.random() * 3)]
      });
    }
  }

  const hotels = [
    { name: `Luxury ${dest.name} Resort`, stars: 5, price: 15000 },
    { name: `Heritage ${dest.name} Hotel`, stars: 4, price: 8000 },
    { name: `Comfort ${dest.name} Inn`, stars: 3, price: 4000 },
    { name: `Budget ${dest.name} Stay`, stars: 2, price: 2000 }
  ].map((h, i) => ({
    id: generateId('hotel'),
    name: h.name,
    destination: dest.name,
    description: `${h.stars}-star ${h.name.toLowerCase()} with modern amenities.`,
    experiential_tags: [h.stars >= 4 ? 'luxury' : 'budget', 'comfort'],
    star_rating: h.stars,
    price_per_night: h.price + Math.floor(Math.random() * 2000),
    amenities: ['WiFi', 'Restaurant', 'Parking', 'AC'].slice(0, 3 + Math.floor(Math.random() * 2)),
    location: {
      lat: dest.lat + (Math.random() - 0.5) * 0.03,
      lng: dest.lng + (Math.random() - 0.5) * 0.03,
      address: `City Center, ${dest.name}`
    },
    images: [IMAGES.heritage],
    user_rating: 3.8 + Math.random() * 1.2
  }));

  const restaurants = [
    { name: `${dest.name} Heritage Kitchen`, price: 1000 },
    { name: `${dest.name} Spice Garden`, price: 600 },
    { name: `${dest.name} Street Food`, price: 300 },
    { name: `${dest.name} Rooftop Café`, price: 800 }
  ].map((r, i) => ({
    id: generateId('rest'),
    name: r.name,
    destination: dest.name,
    description: `Popular restaurant in ${dest.name} serving local cuisine.`,
    cuisine: ['Local', 'Continental'],
    experiential_tags: ['food', 'dining'],
    price_range: r.price > 700 ? '₹₹' : '₹',
    avg_cost_per_person: r.price,
    location: {
      lat: dest.lat + (Math.random() - 0.5) * 0.02,
      lng: dest.lng + (Math.random() - 0.5) * 0.02,
      address: `Food Street, ${dest.name}`
    },
    images: [IMAGES.urban],
    user_rating: 4.0 + Math.random() * 1,
    best_for: 'Dinner'
  }));

  await Activity.insertMany(activities);
  await Hotel.insertMany(hotels);
  await Restaurant.insertMany(restaurants);

  console.log(`   ✅ Added: ${activities.length} activities, ${hotels.length} hotels, ${restaurants.length} restaurants`);
  return { activities: activities.length, hotels: hotels.length, restaurants: restaurants.length };
}

async function main() {
  const targetCount = parseInt(process.argv[2]) || DESTINATIONS.length;

  console.log('🆓 Free Destination Expander (Zero Budget)\n');
  console.log('   Using: Wikipedia API + Static Templates\n');

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auratravel';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  let processed = 0, skipped = 0;

  for (const dest of DESTINATIONS.slice(0, targetCount)) {
    const result = await enrichDestination(dest);
    if (result.skipped) skipped++;
    else processed++;

    // Rate limit to be nice to Wikipedia
    await new Promise(r => setTimeout(r, 300));
  }

  const counts = await Promise.all([
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments()
  ]);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL STATS:');
  console.log(`   Processed: ${processed}`);
  console.log(`   Skipped: ${skipped}`);
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