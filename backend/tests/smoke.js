require('dotenv').config();

const mongoose = require('mongoose');
const connectDB = require('../src/config/db');
const Activity = require('../src/models/Activity');
const Hotel = require('../src/models/Hotel');
const Restaurant = require('../src/models/Restaurant');

async function smoke() {
  await connectDB();

  const [activities, hotels, restaurants] = await Promise.all([
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments()
  ]);

  console.log('Aura Travel backend smoke check');
  console.log(`Activities: ${activities}`);
  console.log(`Hotels: ${hotels}`);
  console.log(`Restaurants: ${restaurants}`);

  if (activities + hotels + restaurants < 110) {
    throw new Error('Catalog has fewer than 110 entities. Run npm run seed.');
  }

  await mongoose.disconnect();
}

smoke().catch(async (error) => {
  console.error(error.message);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
