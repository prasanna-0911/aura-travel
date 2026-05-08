const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    address: { type: String, required: true }
  },
  { _id: false }
);

const hotelSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    destination: { type: String, required: true, index: true },
    description: { type: String, default: '' },
    experiential_tags: [{ type: String, index: true }],
    star_rating: { type: Number, min: 1, max: 5, default: 3 },
    price_per_night: { type: Number, required: true, min: 0 },
    amenities: [{ type: String }],
    location: { type: locationSchema, required: true },
    images: [{ type: String }],
    user_rating: { type: Number, min: 0, max: 5, default: 4.4 }
  },
  { timestamps: true, id: false }
);

hotelSchema.index({ destination: 1, price_per_night: 1 });

module.exports = mongoose.model('Hotel', hotelSchema);
