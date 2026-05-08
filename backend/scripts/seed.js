require('dotenv').config();

const bcrypt = require('bcryptjs');
const connectDB = require('../src/config/db');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');
const User = require('../src/models/User');
const { loadFrontendCatalog } = require('../src/utils/frontendDataLoader');
const {
  additionalActivities,
  additionalHotels,
  additionalRestaurants
} = require('../src/data/expansionData');

function dedupeById(items) {
  return Array.from(new Map(items.map((item) => [item.id, item])).values());
}

async function upsertSeedUser({ name, email, password, role }) {
  const hashed = await bcrypt.hash(password, 10);
  await User.findOneAndUpdate(
    { email },
    { name, email, password: hashed, role },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

async function seed() {
  await connectDB();

  const frontendCatalog = loadFrontendCatalog();
  const activities = dedupeById([...frontendCatalog.activities, ...additionalActivities]);
  const hotels = dedupeById([...frontendCatalog.hotels, ...additionalHotels]);
  const restaurants = dedupeById([...frontendCatalog.restaurants, ...additionalRestaurants]);

  await Promise.all([
    Activity.deleteMany({}),
    Hotel.deleteMany({}),
    Restaurant.deleteMany({})
  ]);

  await Promise.all([
    Activity.insertMany(activities),
    Hotel.insertMany(hotels),
    Restaurant.insertMany(restaurants)
  ]);

  await upsertSeedUser({
    name: process.env.SEED_ADMIN_NAME || 'Aura Admin',
    email: process.env.SEED_ADMIN_EMAIL || 'admin@auratravel.local',
    password: process.env.SEED_ADMIN_PASSWORD || 'Admin@12345',
    role: 'admin'
  });

  await upsertSeedUser({
    name: process.env.SEED_USER_NAME || 'Demo Traveller',
    email: process.env.SEED_USER_EMAIL || 'user@auratravel.local',
    password: process.env.SEED_USER_PASSWORD || 'User@12345',
    role: 'user'
  });

  console.log('Aura Travel seed complete');
  console.log(`Activities: ${activities.length}`);
  console.log(`Hotels: ${hotels.length}`);
  console.log(`Restaurants: ${restaurants.length}`);
  console.log(`Catalog entities: ${activities.length + hotels.length + restaurants.length}`);

  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
