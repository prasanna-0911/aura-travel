/**
 * Script to populate destinations with activities, hotels, and restaurants
 *
 * Usage: node scripts/populateDestinations.js
 *
 * This script adds curated destination data for popular travel destinations.
 * Run npm run seed first to seed the base database.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');

const DESTINATIONS = [
  {
    name: 'Jaipur',
    description: 'The Pink City - a royal blend of history, culture, and architecture',
    tags: ['heritage', 'cultural', 'historical', 'architecture', 'food']
  },
  {
    name: 'Kerala',
    description: 'God\'s Own Country - backwaters, beaches, and ayurvedic wellness',
    tags: ['backwaters', 'beach', 'wellness', 'nature', 'spa']
  },
  {
    name: 'Mumbai',
    description: 'The City of Dreams - Bollywood, beaches, and street food',
    tags: ['urban', 'city', 'food', 'nightlife', 'culture']
  },
  {
    name: 'Delhi',
    description: 'India\'s capital - monuments, markets, and diverse cuisine',
    tags: ['historical', 'cultural', 'urban', 'food', 'heritage']
  },
  {
    name: 'Rishikesh',
    description: 'Yoga capital of the world - adventure and spiritual retreats',
    tags: ['adventure', 'spiritual', 'yoga', 'nature', 'riverside']
  },
  {
    name: 'Udaipur',
    description: 'City of Lakes - romantic palaces and serene waters',
    tags: ['romantic', 'heritage', 'lake', 'premium', 'cultural']
  },
  {
    name: 'Varanasi',
    description: 'The spiritual capital - ancient ghats and divine experiences',
    tags: ['spiritual', 'historical', 'cultural', 'heritage', 'pilgrimage']
  },
  {
    name: 'Shimla',
    description: 'Queen of Hill Stations - colonial charm and mountain beauty',
    tags: ['mountain', 'nature', 'family-friendly', 'heritage', 'romantic']
  }
];

// Activity templates per category
const ACTIVITY_TEMPLATES = {
  heritage: [
    { name: 'Amber Fort Exploration', desc: 'Explore the magnificent Amber Fort with its stunning architecture and mirror work.', duration: 3, cost: 500 },
    { name: 'City Palace Visit', desc: 'Discover the royal heritage at City Palace with its museums and panoramic views.', duration: 2, cost: 400 },
    { name: 'Heritage Walking Tour', desc: 'Guided walking tour through historic streets and ancient monuments.', duration: 2, cost: 300 }
  ],
  beach: [
    { name: 'Beach Sunrise Walk', desc: 'Start your day with a peaceful walk along pristine beaches.', duration: 1, cost: 0 },
    { name: 'Water Sports Adventure', desc: 'Enjoy jet skiing, parasailing, and banana boat rides.', duration: 2, cost: 1500 },
    { name: 'Sunset Beach Meditation', desc: 'Experience tranquility with sunset meditation on the beach.', duration: 1, cost: 0 }
  ],
  adventure: [
    { name: 'Trek to Mountain Peak', desc: 'Challenging trek with breathtaking views of the surrounding mountains.', duration: 5, cost: 800 },
    { name: 'River Rafting', desc: 'Thrilling white water rafting experience through rapids.', duration: 3, cost: 1200 },
    { name: 'Camping Under Stars', desc: 'Overnight camping experience with bonfire and stargazing.', duration: 8, cost: 600 }
  ],
  spiritual: [
    { name: 'Morning Yoga Session', desc: 'Start your day with traditional yoga and meditation.', duration: 2, cost: 300 },
    { name: 'Temple Visit', desc: 'Guided tour of ancient temples with spiritual insights.', duration: 2, cost: 100 },
    { name: 'Ganga Aarti Experience', desc: 'Witness the mesmerizing evening Ganga Aarti ceremony.', duration: 1, cost: 0 }
  ],
  food: [
    { name: 'Street Food Tour', desc: 'Explore local markets and taste authentic street food.', duration: 3, cost: 400 },
    { name: 'Cooking Class', desc: 'Learn to cook traditional dishes with local chefs.', duration: 3, cost: 800 },
    { name: 'Food Market Walk', desc: 'Guided tour of bustling food markets and spice shops.', duration: 2, cost: 300 }
  ]
};

const HOTEL_TEMPLATES = [
  { name: 'Heritage Haveli', stars: 4, price: 6000, tags: ['heritage', 'romantic', 'premium'] },
  { name: 'City Boutique Hotel', stars: 3, price: 3500, tags: ['urban', 'mid-range', 'food'] },
  { name: 'Mountain View Resort', stars: 4, price: 5500, tags: ['nature', 'romantic', 'wellness'] },
  { name: 'Budget Inn', stars: 2, price: 1800, tags: ['budget-friendly', 'city'] },
  { name: 'Luxury Palace Hotel', stars: 5, price: 12000, tags: ['premium', 'luxurious', 'heritage'] }
];

const RESTAURANT_TEMPLATES = [
  { name: 'Heritage Dining', cuisine: ['Indian', 'Continental'], price: 1200, tags: ['romantic', 'premium'] },
  { name: 'Local Spice Kitchen', cuisine: ['Indian', 'Regional'], price: 500, tags: ['budget-friendly', 'food'] },
  { name: 'Rooftop Café', cuisine: ['Continental', 'Café'], price: 700, tags: ['evening', 'social'] }
];

function generateId(prefix, index) {
  return `${prefix}-${Date.now()}-${index}`.substring(0, 30);
}

function getRandomImage(category, index) {
  const images = {
    heritage: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800',
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800',
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800'
    ],
    beach: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800',
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=800'
    ],
    adventure: [
      'https://images.unsplash.com/photo-1533130061792-64b9e998a58b?w=800',
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=800'
    ],
    spiritual: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=800',
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=800',
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800'
    ],
    food: [
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800',
      'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'
    ]
  };
  return images[category]?.[index % 3] || images.heritage[0];
}

async function populateDestinations() {
  console.log('🚀 Starting destination population...\n');

  // Connect to database
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auratravel';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  let totalActivities = 0;
  let totalHotels = 0;
  let totalRestaurants = 0;

  for (const dest of DESTINATIONS) {
    console.log(`📍 Processing ${dest.name}...`);

    // Check if destination already exists
    const existingCount = await Activity.countDocuments({ destination: dest.name });
    if (existingCount > 10) {
      console.log(`   ⚠️  ${dest.name} already has ${existingCount} activities, skipping...`);
      continue;
    }

    const destActivities = [];
    const destHotels = [];
    const destRestaurants = [];

    // Generate activities from templates
    for (const category of Object.keys(ACTIVITY_TEMPLATES)) {
      const templates = ACTIVITY_TEMPLATES[category];
      for (let i = 0; i < templates.length; i++) {
        const template = templates[i];
        const activity = new Activity({
          id: generateId(`act-${dest.name.toLowerCase().substring(0, 4)}`, totalActivities + i),
          name: `${template.name} - ${dest.name}`,
          destination: dest.name,
          category,
          description: template.desc,
          experiential_tags: [...dest.tags, category],
          duration_hours: template.duration + Math.random(),
          cost_inr: template.cost + Math.floor(Math.random() * 200),
          opening_hours: { weekday: '09:00-18:00', weekend: '09:00-20:00' },
          location: {
            lat: 26.9 + Math.random() * 5,
            lng: 75.8 + Math.random() * 5,
            address: `${dest.name}, India`
          },
          images: [getRandomImage(category, i)],
          user_rating: 3.8 + Math.random() * 1.2,
          accessibility: ['easy-access', 'moderate-difficulty'][Math.floor(Math.random() * 2)],
          best_time: ['morning', 'afternoon', 'evening', 'anytime'][Math.floor(Math.random() * 4)]
        });
        destActivities.push(activity);
        totalActivities++;
      }
    }

    // Generate hotels
    for (let i = 0; i < HOTEL_TEMPLATES.length; i++) {
      const template = HOTEL_TEMPLATES[i];
      const hotel = new Hotel({
        id: generateId(`hotel-${dest.name.toLowerCase().substring(0, 4)}`, i),
        name: `${template.name} - ${dest.name}`,
        destination: dest.name,
        description: `Comfortable ${template.stars}-star hotel in ${dest.name} offering ${template.tags.join(', ')} experiences.`,
        experiential_tags: template.tags,
        star_rating: template.stars,
        price_per_night: template.price + Math.floor(Math.random() * 2000),
        amenities: ['WiFi', 'Restaurant', 'Parking', 'Room Service', 'AC'],
        location: {
          lat: 26.9 + Math.random() * 5,
          lng: 75.8 + Math.random() * 5,
          address: `Main Market, ${dest.name}`
        },
        images: [generateId('https://images.unsplash.com/photo-1566073771259-6a8506099945', i)],
        user_rating: 3.5 + Math.random() * 1.5
      });
      destHotels.push(hotel);
      totalHotels++;
    }

    // Generate restaurants
    for (let i = 0; i < RESTAURANT_TEMPLATES.length; i++) {
      const template = RESTAURANT_TEMPLATES[i];
      const restaurant = new Restaurant({
        id: generateId(`rest-${dest.name.toLowerCase().substring(0, 4)}`, i),
        name: `${template.name} - ${dest.name}`,
        destination: dest.name,
        description: `Popular ${template.cuisine.join(' & ')} restaurant in ${dest.name} perfect for ${template.tags.join(', ')}.`,
        cuisine: template.cuisine,
        experiential_tags: template.tags,
        price_range: template.price > 800 ? '₹₹₹' : '₹₹',
        avg_cost_per_person: template.price + Math.floor(Math.random() * 300),
        location: {
          lat: 26.9 + Math.random() * 5,
          lng: 75.8 + Math.random() * 5,
          address: `Food Street, ${dest.name}`
        },
        images: [generateId('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4', i)],
        user_rating: 3.8 + Math.random() * 1.2,
        best_for: template.tags[0]
      });
      destRestaurants.push(restaurant);
      totalRestaurants++;
    }

    // Save to database
    await Activity.insertMany(destActivities);
    await Hotel.insertMany(destHotels);
    await Restaurant.insertMany(destRestaurants);

    console.log(`   ✅ Added: ${destActivities.length} activities, ${destHotels.length} hotels, ${destRestaurants.length} restaurants`);
  }

  // Summary
  const finalCounts = await Promise.all([
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments()
  ]);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 Final Database Stats:');
  console.log(`   Activities: ${finalCounts[0]}`);
  console.log(`   Hotels: ${finalCounts[1]}`);
  console.log(`   Restaurants: ${finalCounts[2]}`);
  console.log(`   Total: ${finalCounts[0] + finalCounts[1] + finalCounts[2]}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  console.log('✅ Population complete!');
}

populateDestinations().catch((error) => {
  console.error('❌ Error:', error.message);
  mongoose.disconnect();
  process.exit(1);
});