/**
 * Bulk Destination Seeder - Scales to thousands of destinations
 *
 * Usage: node scripts/bulkSeed.js [count]
 *   node scripts/bulkSeed.js 500  - Add 500 destinations
 *
 * This script generates realistic destination data using templates
 * and randomization to populate thousands of destinations efficiently.
 */

require('dotenv').config();
const mongoose = require('mongoose');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');

const COUNTRIES = [
  { name: 'India', regions: ['North', 'South', 'East', 'West', 'Central'], cities: [
    'Agra', 'Ahmedabad', 'Ajmer', 'Alleppey', 'Amritsar', 'Aurangabad', 'Bhubaneswar', 'Bikaner',
    'Chandigarh', 'Coorg', 'Dharamshala', 'Gangtok', 'Haridwar', 'Hampi', 'Hyderabad', 'Jaisalmer',
    'Jodhpur', 'Kolkata', 'Kovalam', 'Leh', 'Lucknow', 'Madurai', 'Mysore', 'Nagpur', 'Ooty',
    'Pondicherry', 'Ranthambore', 'Srinagar', 'Thiruvananthapuram', 'Tirupati', 'Vellore', 'Visakhapatnam',
    'Wayanad', 'Andaman', 'Lakshadweep', 'Sikkim', 'Darjeeling', 'Shillong', 'Aizawl', 'Imphal',
    'Kohima', 'Itanagar', 'Guwahati', 'Patna', 'Ranchi', 'Puri', 'Gwalior', 'Indore', 'Jabalpur',
    'Bhopal', 'Ujjain', 'Sagar', 'Mathura', 'Vrindavan', 'Varanasi', 'Allahabad', 'Ayodhya'
  ]},
  { name: 'Thailand', regions: ['North', 'South', 'East', 'Central'], cities: [
    'Bangkok', 'Chiang Mai', 'Phuket', 'Krabi', 'Pattaya', 'Koh Samui', 'Koh Tao', 'Ayutthaya',
    'Hua Hin', 'Koh Lanta', 'Sukhothai', 'Lampang', 'Pai', 'Koh Phangan', 'Hat Yai', 'Surat Thani'
  ]},
  { name: 'Vietnam', regions: ['North', 'Central', 'South'], cities: [
    'Hanoi', 'Ho Chi Minh City', 'Da Nang', 'Hoi An', 'Hue', 'Nha Trang', 'Phu Quoc', 'Sapa',
    'Ha Long Bay', 'Can Tho', 'Vung Tau', 'Mui Ne', 'Dalat', 'Quy Nhon', 'Cat Ba', 'Con Dao'
  ]},
  { name: 'Indonesia', regions: ['Bali', 'Java', 'Sumatra', 'Sulawesi'], cities: [
    'Bali', 'Jakarta', 'Yogyakarta', 'Bandung', 'Surabaya', 'Lombok', 'Gili Islands', 'Komodo',
    'Flores', 'Borneo', 'Lombok', 'Semarang', 'Malang', 'Solo', 'Bromo', 'Raja Ampat'
  ]},
  { name: 'Japan', regions: ['Kanto', 'Kansai', 'Tohoku', 'Hokkaido', 'Kyushu'], cities: [
    'Tokyo', 'Kyoto', 'Osaka', 'Hiroshima', 'Nara', 'Sapporo', 'Nagoya', 'Fukuoka', 'Kobe',
    'Yokohama', 'Sendai', 'Takayama', 'Kanazawa', 'Matsumoto', 'Nikko', 'Koya', 'Hakone'
  ]},
  { name: 'Malaysia', regions: ['Peninsular', 'Borneo'], cities: [
    'Kuala Lumpur', 'Penang', 'Langkawi', 'Malacca', 'Cameron Highlands', 'Kota Kinabalu', 'Kuching',
    'Kota Bharu', 'Johor Bahru', 'Putrajaya', 'Ipoh', 'Kuala Terengganu', 'Tioman', 'Redang'
  ]},
  { name: 'Philippines', regions: ['Luzon', 'Visayas', 'Mindanao'], cities: [
    'Manila', 'Cebu', 'Boracay', 'Palawan', 'Bohol', 'Siargao', 'Davao', 'Kalamazoo',
    'El Nido', 'Coron', 'Siquijor', 'Camiguin', 'Bataan', 'Laguna', 'Pangasinan', 'Vigan'
  ]},
  { name: 'Sri Lanka', regions: ['South', 'Central', 'North', 'East'], cities: [
    'Colombo', 'Kandy', 'Galle', 'Sigiriya', 'Dambulla', 'Trincomalee', 'Mirissa', 'Unawatune',
    'Polonnaruwa', 'Anuradhapura', 'Negombo', 'Hikkaduwa', 'Bentota', 'Tangalle', 'Nilaveli'
  ]},
  { name: 'Nepal', regions: ['Central', 'East', 'West'], cities: [
    'Kathmandu', 'Pokhara', 'Chitwan', 'Lukla', 'Namche Bazar', 'Annapurna', 'Everest Base',
    'Lumbini', 'Bhaktapur', 'Patan', 'Nagarkot', 'Bandipur', 'Tansen', 'Gorkha'
  ]},
  { name: 'Cambodia', regions: ['Central', 'North', 'Coastal'], cities: [
    'Phnom Penh', 'Siem Reap', 'Angkor Wat', 'Sihanoukville', 'Kampot', 'Kep', 'Battambang',
    'Kampong Cham', 'Kampong Thom', 'Kratie', 'Koh Rong', 'Banlung'
  ]},
  { name: 'Spain', regions: ['North', 'South', 'East', 'Central', 'Islands'], cities: [
    'Barcelona', 'Madrid', 'Seville', 'Valencia', 'Malaga', 'Granada', 'Bilbao', 'San Sebastian',
    'Cordoba', 'Toledo', 'Mallorca', 'Ibiza', 'Canary Islands', 'Zaragoza', 'Salamanca'
  ]},
  { name: 'Italy', regions: ['North', 'Central', 'South', 'Islands'], cities: [
    'Rome', 'Florence', 'Venice', 'Milan', 'Naples', 'Turin', 'Bologna', 'Genoa', 'Palermo',
    'Catania', 'Verona', 'Siena', 'Pisa', 'Amalfi', 'Capri', 'Sardinia', 'Cinque Terre'
  ]},
  { name: 'Greece', regions: ['Mainland', 'Islands'], cities: [
    'Athens', 'Santorini', 'Mykonos', 'Crete', 'Rhodes', 'Paros', 'Naxos', 'Corfu', 'Zakynthos',
    'Delphi', 'Olympia', 'Meteora', 'Thessaloniki', 'Lesvos', 'Skiathos'
  ]},
  { name: 'Portugal', regions: ['North', 'South', 'Central', 'Islands'], cities: [
    'Lisbon', 'Porto', 'Sintra', 'Cascais', 'Albufeira', 'Faro', ' Lagos', 'Coimbra', 'Braga',
    'Guimaraes', 'Evora', 'Madeira', 'Azores'
  ]},
  { name: 'Turkey', regions: ['West', 'Central', 'East', 'Mediterranean'], cities: [
    'Istanbul', 'Cappadocia', 'Ephesus', 'Antalya', 'Bodrum', 'Marmaris', 'Fethiye', 'Pamukkale',
    'Izmir', 'Ankara', 'Trabzon', 'Gallipoli', 'Safranbolu', 'Konya'
  ]},
  { name: 'Morocco', regions: ['North', 'South', 'Central', 'Sahara'], cities: [
    'Marrakech', 'Fes', 'Casablanca', 'Tangier', 'Chefchaouen', 'Essaouira', 'Agadir', 'Ouarzazate',
    'Merzouga', 'Rabat', 'Meknes', 'Errachidia', 'Zagora'
  ]},
  { name: 'Peru', regions: ['Coast', 'Highlands', 'Jungle'], cities: [
    'Lima', 'Cusco', 'Machu Picchu', 'Arequipa', 'Puno', 'Lake Titicaca', 'Nazca', 'Trujillo',
    'Chiclayo', 'Iquitos', 'Paracas', 'Huacachina', 'Huaraz'
  ]},
  { name: 'Mexico', regions: ['North', 'Central', 'South', 'Caribbean'], cities: [
    'Mexico City', 'Cancun', 'Playa del Carmen', 'Cozumel', 'Puerto Vallarta', 'Los Cabos',
    'Guanajuato', 'San Miguel de Allende', 'Oaxaca', 'Chichen Itza', 'Tulum', 'Merida',
    'Guadalajara', 'Monterrey', 'Puebla'
  ]},
  { name: 'USA', regions: ['West', 'East', 'South', 'Midwest', 'Hawaii', 'Alaska'], cities: [
    'New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Honolulu', 'Seattle',
    'Denver', 'Chicago', 'Boston', 'New Orleans', 'Austin', 'Phoenix', 'Portland', 'San Diego',
    'Santa Fe', 'Savannah', 'Charleston', 'Nashville', 'Memphis', 'Anchorage', 'Maui', 'Kauai'
  ]},
  { name: 'France', regions: ['North', 'South', 'East', 'West', 'Islands'], cities: [
    'Paris', 'Nice', 'Cannes', 'Lyon', 'Marseille', 'Bordeaux', 'Strasbourg', 'Toulouse',
    'Saint Tropez', 'Avignon', 'Annecy', 'Mont Saint Michel', 'Versailles', 'Provence',
    'Corsica', 'French Riviera', 'Loire Valley'
  ]}
];

const CATEGORIES = {
  heritage: { weight: 25, tags: ['historical', 'cultural', 'architecture', 'museum'] },
  beach: { weight: 20, tags: ['beach', 'swimming', 'sunset', 'water-sports'] },
  nature: { weight: 20, tags: ['hiking', 'wildlife', 'photography', 'birds'] },
  adventure: { weight: 15, tags: ['trekking', 'climbing', 'riverside', 'camping'] },
  spiritual: { weight: 10, tags: ['temple', 'meditation', 'yoga', 'pilgrimage'] },
  urban: { weight: 10, tags: ['shopping', 'nightlife', 'food', 'culture'] }
};

const ACTIVITY_TEMPLATES = {
  heritage: [
    'Fort Exploration', 'Palace Visit', 'Heritage Walk', 'Museum Tour', 'Ancient Temple Visit',
    'Monument Walk', 'Ruin Exploration', 'Traditional Craft Workshop', 'Architecture Tour', 'Historical Site Visit'
  ],
  beach: [
    'Beach Sunrise Walk', 'Sunset Viewing', 'Water Sports', 'Beach Relaxation', 'Snorkeling',
    'Island Hopping', 'Beach Yoga', 'Sandcastle Building', 'Beach Volleyball', 'Sunset Cruise'
  ],
  nature: [
    'Nature Trail Hike', 'Waterfall Visit', 'Bird Watching', 'Wildlife Safari', 'Sunrise Trek',
    'Botanical Garden Visit', 'Lake Tour', 'Canyon Exploration', 'Forest Walk', 'Valley Viewpoint'
  ],
  adventure: [
    'Mountain Trek', 'Rock Climbing', 'Rafting', 'Camping Night', 'Zip Lining', 'Bungee Jumping',
    'Paragliding', 'Scuba Diving', 'Hot Air Balloon', 'Cycling Tour'
  ],
  spiritual: [
    'Temple Visit', 'Meditation Session', 'Yoga Class', 'Pilgrimage Walk', 'Ganga Aarti',
    'Monastery Tour', 'Ashram Visit', 'Spiritual Talk', 'Chanting Session', 'Temple Festival'
  ],
  urban: [
    'Street Food Tour', 'Market Shopping', 'Local Cuisine Experience', 'Nightlife Tour',
    'Café Hopping', 'Art Gallery Visit', 'Theater Show', 'Local Concert', 'City Panorama View', 'Heritage Architecture'
  ]
};

const HOTEL_TEMPLATES = [
  { prefix: 'Grand', stars: 5, priceMult: 4 },
  { prefix: 'Luxury', stars: 5, priceMult: 4.5 },
  { prefix: 'Premium', stars: 4, priceMult: 3 },
  { prefix: 'Heritage', stars: 4, priceMult: 2.5 },
  { prefix: 'Comfort', stars: 3, priceMult: 2 },
  { prefix: 'Standard', stars: 3, priceMult: 1.5 },
  { prefix: 'Budget', stars: 2, priceMult: 1 },
  { prefix: 'Express', stars: 2, priceMult: 0.8 },
  { prefix: 'Value', stars: 1, priceMult: 0.5 },
  { prefix: 'Basic', stars: 1, priceMult: 0.3 }
];

const RESTAURANT_TEMPLATES = [
  { prefix: 'Spice Garden', cuisine: ['Indian', 'Continental'], price: 800 },
  { prefix: 'Heritage Kitchen', cuisine: ['Local', 'Traditional'], price: 500 },
  { prefix: 'Rooftop View', cuisine: ['International', 'Fusion'], price: 1200 },
  { prefix: 'Seaside', cuisine: ['Seafood', 'Local'], price: 700 },
  { prefix: 'Mountain View', cuisine: ['Continental', 'Local'], price: 600 },
  { prefix: 'City Center', cuisine: ['Fast Food', 'Café'], price: 400 },
  { prefix: 'Local Eats', cuisine: ['Street Food', 'Local'], price: 250 },
  { prefix: 'Fine Dining', cuisine: ['Fine Dining', 'International'], price: 2000 }
];

const AMENITIES = ['WiFi', 'Pool', 'Restaurant', 'Parking', 'Room Service', 'AC', 'Gym', 'Spa', 'Laundry', 'Airport Shuttle'];
const HOTEL_AMENITY_COUNTS = [3, 4, 5, 6, 7, 8];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 8)}`;
}

function getWeightedCategory() {
  const total = Object.values(CATEGORIES).reduce((sum, c) => sum + c.weight, 0);
  let rand = Math.random() * total;
  for (const [cat, data] of Object.entries(CATEGORIES)) {
    rand -= data.weight;
    if (rand <= 0) return cat;
  }
  return 'heritage';
}

function getImageUrl(category, width = 800) {
  const images = {
    heritage: [
      'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=' + width,
      'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=' + width,
      'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=' + width,
      'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=' + width
    ],
    beach: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=' + width,
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=' + width,
      'https://images.unsplash.com/photo-1471922694854-ff1b63b20054?w=' + width
    ],
    nature: [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=' + width,
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=' + width,
      'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=' + width
    ],
    adventure: [
      'https://images.unsplash.com/photo-1533130061792-64b9e998a58b?w=' + width,
      'https://images.unsplash.com/photo-1551632811-561732d1e306?w=' + width,
      'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=' + width
    ],
    spiritual: [
      'https://images.unsplash.com/photo-1548013146-72479768bada?w=' + width,
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?w=' + width,
      'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=' + width
    ],
    urban: [
      'https://images.unsplash.com/photo-1514924013411-cbf25faa35bb?w=' + width,
      'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=' + width,
      'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=' + width
    ]
  };
  return randomFrom(images[category] || images.heritage);
}

async function bulkSeed(targetCount = 500) {
  console.log('🚀 Starting Bulk Destination Seeder');
  console.log(`   Target: ${targetCount} destinations\n`);

  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auratravel';
  await mongoose.connect(mongoUri);
  console.log('✅ Connected to MongoDB\n');

  const existingDestinations = new Set(
    await Activity.distinct('destination')
  );
  console.log(`📍 Existing destinations in DB: ${existingDestinations.size}`);

  // Collect all destination names
  const allDestinations = [];
  for (const country of COUNTRIES) {
    for (const city of country.cities) {
      allDestinations.push({ name: city, country: country.name });
    }
  }

  const newDestinations = allDestinations.filter(
    d => !existingDestinations.has(d.name)
  );

  console.log(`📍 New destinations available: ${newDestinations.length}`);
  console.log(`📍 Need ${targetCount} - available = ${Math.max(0, targetCount - existingDestinations.size)} more\n`);

  // Process destinations
  let processed = 0;
  let totalActivities = 0;
  let totalHotels = 0;
  let totalRestaurants = 0;

  for (const dest of newDestinations) {
    if (processed >= targetCount - existingDestinations.size) break;

    // Generate activities (10-15 per destination)
    const numActivities = randomBetween(10, 15);
    const activities = [];

    for (let i = 0; i < numActivities; i++) {
      const category = getWeightedCategory();
      const templates = ACTIVITY_TEMPLATES[category];
      const templateName = randomFrom(templates);
      const tags = [...CATEGORIES[category].tags];

      activities.push({
        id: generateId(`act`),
        name: `${dest.name} ${templateName}`,
        destination: dest.name,
        category,
        description: `Experience ${templateName.toLowerCase()} in ${dest.name}, ${dest.country}. A memorable ${tags[0]} adventure.`,
        experiential_tags: tags,
        duration_hours: randomBetween(1, 6),
        cost_inr: randomBetween(0, 2000),
        opening_hours: {
          weekday: '09:00-18:00',
          weekend: '09:00-20:00'
        },
        location: {
          lat: 20 + Math.random() * 20,
          lng: 60 + Math.random() * 80,
          address: `${dest.name}, ${dest.country}`
        },
        images: [getImageUrl(category)],
        user_rating: 3.5 + Math.random() * 1.5,
        accessibility: randomFrom(['easy-access', 'moderate-difficulty']),
        best_time: randomFrom(['morning', 'afternoon', 'evening', 'anytime'])
      });
      totalActivities++;
    }

    // Generate hotels (3-5 per destination)
    const numHotels = randomBetween(3, 5);
    const hotels = [];

    for (let i = 0; i < numHotels; i++) {
      const template = randomFrom(HOTEL_TEMPLATES);
      const basePrice = randomBetween(1500, 8000);

      hotels.push({
        id: generateId(`hotel`),
        name: `${template.prefix} ${dest.name} ${randomFrom(['Hotel', 'Resort', 'Inn', 'Suites'])}`,
        destination: dest.name,
        description: `Comfortable ${template.stars}-star accommodation in ${dest.name} with excellent facilities.`,
        experiential_tags: randomFrom([
          ['luxury', 'premium'],
          ['budget', 'friendly'],
          ['romantic', 'couple'],
          ['family', 'comfortable'],
          ['adventure', 'nature']
        ]),
        star_rating: template.stars,
        price_per_night: Math.round(basePrice * template.priceMult / 100) * 100,
        amenities: randomFrom(AMENITIES).split(',').concat(
          AMENITIES.slice(0, randomFrom(HOTEL_AMENITY_COUNTS) - 1)
        ),
        location: {
          lat: 20 + Math.random() * 20,
          lng: 60 + Math.random() * 80,
          address: `City Center, ${dest.name}`
        },
        images: [getImageUrl('heritage')],
        user_rating: 3.5 + Math.random() * 1.5
      });
      totalHotels++;
    }

    // Generate restaurants (2-3 per destination)
    const numRestaurants = randomBetween(2, 3);
    const restaurants = [];

    for (let i = 0; i < numRestaurants; i++) {
      const template = randomFrom(RESTAURANT_TEMPLATES);

      restaurants.push({
        id: generateId(`rest`),
        name: `${template.prefix} - ${dest.name}`,
        destination: dest.name,
        description: `Popular ${template.cuisine[0]} restaurant in ${dest.name} offering authentic flavors.`,
        cuisine: template.cuisine,
        experiential_tags: randomFrom([
          ['romantic', 'evening'],
          ['family', 'casual'],
          ['budget', 'quick'],
          ['premium', 'fine-dining'],
          ['social', 'group']
        ]),
        price_range: template.price > 1500 ? '₹₹₹' : template.price > 600 ? '₹₹' : '₹',
        avg_cost_per_person: template.price + randomBetween(-100, 300),
        location: {
          lat: 20 + Math.random() * 20,
          lng: 60 + Math.random() * 80,
          address: `Food Street, ${dest.name}`
        },
        images: [getImageUrl('urban')],
        user_rating: 3.5 + Math.random() * 1.5,
        best_for: randomFrom(['Dinner', 'Lunch', 'Breakfast', 'Late Night'])
      });
      totalRestaurants++;
    }

    // Save in batches
    await Activity.insertMany(activities);
    await Hotel.insertMany(hotels);
    await Restaurant.insertMany(restaurants);

    processed++;
    if (processed % 10 === 0) {
      console.log(`   📍 Processed ${processed} destinations (${totalActivities} activities, ${totalHotels} hotels, ${totalRestaurants} restaurants)`);
    }
  }

  // Final stats
  const counts = await Promise.all([
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments()
  ]);

  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 FINAL STATS:');
  console.log(`   Destinations: ${counts[0] ? (await Activity.distinct('destination')).length : 0}`);
  console.log(`   Activities: ${counts[0]}`);
  console.log(`   Hotels: ${counts[1]}`);
  console.log(`   Restaurants: ${counts[2]}`);
  console.log(`   TOTAL: ${counts[0] + counts[1] + counts[2]}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
  console.log('✅ Bulk seeding complete!');
}

// Run
const targetCount = parseInt(process.argv[2]) || 500;
bulkSeed(targetCount).catch(err => {
  console.error('❌ Error:', err.message);
  mongoose.disconnect();
  process.exit(1);
});