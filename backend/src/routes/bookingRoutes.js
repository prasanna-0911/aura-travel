const express = require('express');
const Hotel = require('../models/Hotel');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const { optionalAuth } = require('../middleware/auth');
const { searchFlights } = require('../services/flightService');

const router = express.Router();

function generateBookingId() {
  return `AURA-${Math.random().toString(36).slice(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
}

router.get('/flights', (req, res) => {
  const flights = searchFlights(req.query);
  res.json({ success: true, flights });
});

router.get('/hotels', asyncHandler(async (req, res) => {
  const destination = req.query.destination === 'Kullu (Manali)' ? 'Manali' : req.query.destination;
  const query = destination ? { destination } : {};
  const hotels = await Hotel.find(query).sort('-user_rating price_per_night').lean();
  res.json({ success: true, hotels });
}));

router.post('/bookings/confirm', optionalAuth, asyncHandler(async (req, res) => {
  const flightBooking = req.body.flightBooking || req.body.flight_booking || null;
  const hotelBooking = req.body.hotelBooking || req.body.hotel_booking || null;
  const destination = req.body.destination || hotelBooking?.hotel?.destination || flightBooking?.flight?.destination?.city || 'Goa';
  const contactDetails = req.body.contactDetails || req.body.contact_details;

  if (!contactDetails?.name || !contactDetails?.email || !contactDetails?.phone) {
    return res.status(400).json({ success: false, message: 'Contact details are required.' });
  }

  const totalCost = Number(req.body.totalCost ?? req.body.total_cost ?? 0)
    || (flightBooking?.totalPrice || 0) + (hotelBooking?.totalPrice || 0);

  const booking = await Booking.create({
    bookingId: generateBookingId(),
    user: req.user?._id || null,
    destination,
    flightBooking,
    hotelBooking,
    totalCost,
    paymentMethod: req.body.paymentMethod || req.body.payment_method || 'card',
    contactDetails
  });

  res.status(201).json({
    success: true,
    booking_confirmation: {
      id: booking.bookingId,
      createdAt: booking.createdAt,
      destination: booking.destination,
      flightBooking: booking.flightBooking,
      hotelBooking: booking.hotelBooking,
      totalCost: booking.totalCost,
      status: booking.status,
      paymentMethod: booking.paymentMethod,
      contactDetails: booking.contactDetails
    }
  });
}));

router.get('/bookings', optionalAuth, asyncHandler(async (req, res) => {
  const query = req.user ? { user: req.user._id } : {};
  const bookings = await Booking.find(query).sort('-createdAt').lean();
  res.json({ success: true, bookings });
}));

module.exports = router;
