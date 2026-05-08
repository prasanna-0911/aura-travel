const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    bookingId: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    destination: { type: String, required: true },
    flightBooking: { type: mongoose.Schema.Types.Mixed, default: null },
    hotelBooking: { type: mongoose.Schema.Types.Mixed, default: null },
    totalCost: { type: Number, default: 0 },
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'confirmed' },
    paymentMethod: { type: String, default: 'card' },
    contactDetails: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
