const express = require('express');
const Trip = require('../models/Trip');
const asyncHandler = require('../utils/asyncHandler');
const { optionalAuth, protect } = require('../middleware/auth');

const router = express.Router();

function getEndDate(startDate, duration) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + Math.max(Number(duration || 1) - 1, 0));
  return date;
}

router.post('/start', optionalAuth, asyncHandler(async (req, res) => {
  const { itinerary, start_date: startDateInput } = req.body;

  if (!itinerary || !itinerary.id) {
    return res.status(400).json({ success: false, message: 'A generated itinerary is required to start a trip.' });
  }

  const startDate = startDateInput ? new Date(startDateInput) : new Date();
  const trip = await Trip.create({
    user: req.user?._id || null,
    itineraryId: itinerary.id,
    destination: itinerary.destination,
    startDate,
    endDate: getEndDate(startDate, itinerary.duration),
    itinerary,
    status: 'active'
  });

  res.status(201).json({ success: true, trip_id: trip._id, trip });
}));

router.get('/current', protect, asyncHandler(async (req, res) => {
  const trip = await Trip.findOne({ user: req.user._id, status: 'active' }).sort('-createdAt').lean();
  res.json({ success: true, trip });
}));

router.post('/:tripId/complete-activity', optionalAuth, asyncHandler(async (req, res) => {
  const trip = await Trip.findById(req.params.tripId);
  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });

  const currentDay = trip.itinerary.days[trip.currentDayIndex];
  const currentSlot = currentDay?.activities?.[trip.currentActivityIndex];
  if (currentSlot?.activity?.id) {
    trip.completedActivities.push(currentSlot.activity.id);
  }

  if (currentDay && trip.currentActivityIndex + 1 < currentDay.activities.length) {
    trip.currentActivityIndex += 1;
  } else if (trip.currentDayIndex + 1 < trip.itinerary.days.length) {
    trip.currentDayIndex += 1;
    trip.currentActivityIndex = 0;
  } else {
    trip.status = 'completed';
  }

  await trip.save();
  res.json({ success: true, trip });
}));

module.exports = router;
