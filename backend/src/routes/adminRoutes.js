const express = require('express');
const { body } = require('express-validator');
const Activity = require('../models/Activity');
const Hotel = require('../models/Hotel');
const Restaurant = require('../models/Restaurant');
const Trip = require('../models/Trip');
const User = require('../models/User');
const Booking = require('../models/Booking');
const asyncHandler = require('../utils/asyncHandler');
const validate = require('../middleware/validate');
const { protect, requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/activities', asyncHandler(async (req, res) => {
  const activities = await Activity.find({}).sort('destination name').lean();
  res.json({ success: true, activities, total: activities.length });
}));

router.post(
  '/activities',
  [
    body('name').trim().notEmpty(),
    body('destination').trim().notEmpty(),
    body('category').trim().notEmpty(),
    body('description').trim().notEmpty(),
    validate
  ],
  asyncHandler(async (req, res) => {
    const count = await Activity.countDocuments({ destination: req.body.destination });
    const destinationPrefix = req.body.destination.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const activity = await Activity.create({
      id: req.body.id || `${destinationPrefix}-admin-${count + 1}`,
      experiential_tags: [],
      duration_hours: 2,
      cost_inr: 0,
      opening_hours: { weekday: '09:00-18:00', weekend: '09:00-18:00' },
      location: { lat: 15.4909, lng: 73.8278, address: req.body.destination },
      images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop'],
      user_rating: 4.5,
      accessibility: 'easy-access',
      best_time: 'anytime',
      ...req.body
    });

    res.status(201).json({ success: true, activity });
  })
);

router.put('/activities/:id', asyncHandler(async (req, res) => {
  const activity = await Activity.findOneAndUpdate(
    { id: req.params.id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
  res.json({ success: true, activity });
}));

router.delete('/activities/:id', asyncHandler(async (req, res) => {
  const activity = await Activity.findOneAndDelete({ id: req.params.id });
  if (!activity) return res.status(404).json({ success: false, message: 'Activity not found' });
  res.json({ success: true, message: 'Activity deleted' });
}));

router.get('/analytics', asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalTrips,
    totalBookings,
    totalActivities,
    totalHotels,
    totalRestaurants,
    popularDestinations,
    tagUsage
  ] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Booking.countDocuments(),
    Activity.countDocuments(),
    Hotel.countDocuments(),
    Restaurant.countDocuments(),
    Activity.aggregate([{ $group: { _id: '$destination', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Activity.aggregate([{ $unwind: '$experiential_tags' }, { $group: { _id: '$experiential_tags', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 15 }])
  ]);

  res.json({
    success: true,
    total_users: totalUsers,
    total_trips: totalTrips,
    total_bookings: totalBookings,
    total_activities: totalActivities,
    total_hotels: totalHotels,
    total_restaurants: totalRestaurants,
    total_entities: totalActivities + totalHotels + totalRestaurants,
    popular_destinations: popularDestinations,
    tag_usage_stats: tagUsage
  });
}));

module.exports = router;
