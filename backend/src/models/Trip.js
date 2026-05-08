const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    itineraryId: { type: String, required: true },
    destination: { type: String, required: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date },
    status: { type: String, enum: ['planned', 'active', 'completed'], default: 'active' },
    itinerary: { type: mongoose.Schema.Types.Mixed, required: true },
    currentDayIndex: { type: Number, default: 0 },
    currentActivityIndex: { type: Number, default: 0 },
    completedActivities: [{ type: String }],
    skippedActivities: [{ type: String }],
    suggestionsReceived: [
      {
        timestamp: { type: Date, default: Date.now },
        context: { type: String },
        originalActivityId: { type: String },
        suggestedActivityId: { type: String },
        userAction: { type: String, enum: ['accepted', 'declined', 'pending'], default: 'pending' }
      }
    ]
  },
  { timestamps: true }
);

tripSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model('Trip', tripSchema);
