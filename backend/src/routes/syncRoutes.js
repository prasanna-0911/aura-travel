const express = require('express');
const Trip = require('../models/Trip');
const Activity = require('../models/Activity');
const asyncHandler = require('../utils/asyncHandler');
const { checkConflicts, normalizeContextChange } = require('../services/syncService');

const router = express.Router();

function getCurrentActivityFromTrip(trip) {
  const day = trip.itinerary.days?.[trip.currentDayIndex || 0];
  const slot = day?.activities?.[trip.currentActivityIndex || 0];
  return slot?.activity || null;
}

router.post('/check-conflicts', asyncHandler(async (req, res) => {
  const tripId = req.body.trip_id || req.body.tripId;
  const contextChange = normalizeContextChange(req.body.context_change || req.body.contextChange || req.body);
  let currentActivity = req.body.currentActivity || req.body.current_activity || null;
  let destination = req.body.destination;
  let trip = null;

  if (tripId) {
    trip = await Trip.findById(tripId).lean();
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    currentActivity = getCurrentActivityFromTrip(trip);
    destination = trip.destination;
  }

  if (!currentActivity?.id && req.body.activity_id) {
    currentActivity = await Activity.findOne({ id: req.body.activity_id }).lean();
  }

  if (!currentActivity || !destination) {
    return res.status(400).json({ success: false, message: 'Current activity and destination are required.' });
  }

  const result = await checkConflicts(currentActivity, contextChange, destination, req.body.excludeIds || []);

  res.json({
    success: true,
    conflict: result.hasConflict,
    next_activity: currentActivity,
    ...result
  });
}));

router.post('/accept-suggestion', asyncHandler(async (req, res) => {
  const { trip_id: tripId, suggested_activity_id: suggestedActivityId, activity_id: legacyActivityId } = req.body;
  const targetActivityId = suggestedActivityId || legacyActivityId;

  if (!tripId || !targetActivityId) {
    return res.status(400).json({ success: false, message: 'trip_id and suggested_activity_id are required.' });
  }

  const [trip, suggestedActivity] = await Promise.all([
    Trip.findById(tripId),
    Activity.findOne({ id: targetActivityId }).lean()
  ]);

  if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
  if (!suggestedActivity) return res.status(404).json({ success: false, message: 'Suggested activity not found' });

  const day = trip.itinerary.days?.[trip.currentDayIndex || 0];
  const slot = day?.activities?.[trip.currentActivityIndex || 0];
  const originalId = slot?.activity?.id;

  if (slot) slot.activity = suggestedActivity;
  trip.markModified('itinerary');
  if (originalId) trip.skippedActivities.push(originalId);
  trip.suggestionsReceived.push({
    context: req.body.context || 'manual',
    originalActivityId: originalId,
    suggestedActivityId: targetActivityId,
    userAction: 'accepted'
  });

  await trip.save();
  res.json({ success: true, updated_trip: trip, trip });
}));

module.exports = router;
