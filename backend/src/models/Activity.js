const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  { _id: false }
);

const activitySchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, index: true },
    category: { type: String, required: true, index: true },
    description: { type: String, required: true },
    experiential_tags: [{ type: String, index: true }],
    duration_hours: { type: Number, required: true, min: 0 },
    cost_inr: { type: Number, required: true, min: 0 },
    opening_hours: {
      weekday: { type: String, default: '09:00-18:00' },
      weekend: { type: String, default: '09:00-18:00' }
    },
    location: { type: locationSchema, required: true },
    images: [{ type: String }],
    user_rating: { type: Number, min: 0, max: 5, default: 4.5 },
    accessibility: { type: String, default: 'easy-access' },
    best_time: { type: String, enum: ['morning', 'afternoon', 'evening', 'anytime'], default: 'anytime' }
  },
  { timestamps: true, id: false }
);

activitySchema.index({ destination: 1, category: 1 });
activitySchema.index({ destination: 1, experiential_tags: 1 });

module.exports = mongoose.model('Activity', activitySchema);
