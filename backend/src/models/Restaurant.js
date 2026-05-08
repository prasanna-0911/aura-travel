const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    cuisine: [{ type: String }],
    experiential_tags: [{ type: String, index: true }],
    price_range: { type: String, default: 'RsRs' },
    avg_cost_per_person: { type: Number, min: 0, default: 700 },
    location: { type: locationSchema, required: true },
    images: [{ type: String }],
    user_rating: { type: Number, min: 0, max: 5, default: 4.4 },
    best_for: { type: String, default: 'casual dining' }
  },
  { timestamps: true, id: false }
);

restaurantSchema.index({ destination: 1, avg_cost_per_person: 1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
