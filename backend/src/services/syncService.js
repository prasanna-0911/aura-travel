const Activity = require('../models/Activity');

const CONFLICT_RULES = {
  weather_rain: {
    conflictingTags: ['outdoors', 'beach', 'hiking', 'water-sports', 'outdoor', 'trekking'],
    preferredTags: ['indoors', 'indoor', 'cultural', 'shopping', 'food', 'wellness', 'spa'],
    impact: 'Outdoor activities may be affected'
  },
  weather_hot: {
    conflictingTags: ['hiking', 'trekking', 'adventure', 'outdoors'],
    preferredTags: ['indoors', 'indoor', 'beach', 'water-sports', 'wellness', 'spa', 'pool'],
    impact: 'Strenuous outdoor activities are not recommended'
  },
  overcrowding: {
    conflictingTags: ['popular', 'touristy'],
    preferredTags: ['secluded', 'peaceful', 'offbeat', 'quiet', 'hidden'],
    impact: 'Long wait times and crowded experience expected'
  },
  user_tired: {
    conflictingTags: ['adventurous', 'hiking', 'trekking', 'thrilling', 'adventure', 'challenging'],
    preferredTags: ['relaxing', 'peaceful', 'wellness', 'spa', 'leisure', 'easy-access'],
    impact: 'High-energy activities may be exhausting'
  },
  user_hungry: {
    conflictingTags: [],
    preferredTags: ['food', 'culinary', 'dining', 'cultural'],
    impact: 'Consider a food stop before the next activity'
  },
  running_late: {
    conflictingTags: ['long-duration'],
    preferredTags: ['quick', 'nearby', 'easy-access'],
    impact: 'The schedule may need a shorter activity'
  },
  venue_closed: {
    conflictingTags: [],
    preferredTags: [],
    impact: 'The venue is unavailable'
  }
};

function normalizeContextChange(input = {}) {
  if (input.context_change) return normalizeContextChange(input.context_change);

  if (input.type && CONFLICT_RULES[input.type]) {
    return {
      type: input.type,
      severity: input.severity || 'medium',
      timestamp: input.timestamp || new Date()
    };
  }

  if (input.type === 'weather' && input.value === 'rain') return { type: 'weather_rain', severity: 'medium', timestamp: new Date() };
  if (input.type === 'weather' && input.value === 'hot') return { type: 'weather_hot', severity: 'medium', timestamp: new Date() };
  if (input.type === 'overcrowding') return { type: 'overcrowding', severity: 'medium', timestamp: new Date() };

  return {
    type: input.type || 'venue_closed',
    severity: input.severity || 'medium',
    timestamp: input.timestamp || new Date()
  };
}

function generateReasoning(contextChange, original, suggested) {
  if (contextChange.type === 'weather_rain') {
    return `It is raining, so ${suggested.name} is a better fit than ${original.name} while keeping the trip close to your original vibe.`;
  }
  if (contextChange.type === 'weather_hot') {
    return `${suggested.name} keeps the plan cooler and easier than ${original.name} during the heat warning.`;
  }
  if (contextChange.type === 'overcrowding') {
    return `${original.name} is crowded. ${suggested.name} gives you a similar ${suggested.category} experience with less friction.`;
  }
  if (contextChange.type === 'user_tired') {
    return `${suggested.name} is a gentler option that still preserves the mood of the day.`;
  }
  if (contextChange.type === 'user_hungry') {
    return `${suggested.name} is a good food-forward stop before continuing your plan.`;
  }
  if (contextChange.type === 'running_late') {
    return `${suggested.name} is easier to fit into the remaining schedule.`;
  }
  return `${original.name} is unavailable, so ${suggested.name} is the best matching alternative nearby.`;
}

function calculateRelevanceScore(original, suggested, preferredTags) {
  const origTags = original.experiential_tags || [];
  const sugTags = suggested.experiential_tags || [];
  const shared = origTags.filter((tag) => sugTags.includes(tag));
  const sharedScore = origTags.length ? shared.length / origTags.length : 0;
  const preferredBonus = Math.min(
    sugTags.filter((tag) => (preferredTags || []).includes(tag)).length * 0.1,
    0.3
  );
  const categoryBonus = original.category === suggested.category ? 0.15 : 0;
  const ratingFactor = ((suggested.user_rating || 0) / 5) * 0.15;
  return Math.round(Math.min(sharedScore + preferredBonus + categoryBonus + ratingFactor, 1) * 100) / 100;
}

async function findAlternatives(currentActivity, contextChange, destination, excludeIds = []) {
  const rule = CONFLICT_RULES[contextChange.type] || CONFLICT_RULES.venue_closed;
  const conflictingTags = rule.conflictingTags || [];
  const preferredTags = rule.preferredTags || [];

  const activities = await Activity.find({
    destination,
    id: { $nin: [currentActivity.id, ...excludeIds] }
  }).lean();

  const activityTags = currentActivity.experiential_tags || [];

  const scored = activities
    .filter((activity) => !((activity.experiential_tags || []).some((tag) => conflictingTags.includes(tag))))
    .map((activity) => {
      const actTags = activity.experiential_tags || [];
      const preferredCount = actTags.filter((tag) => preferredTags.includes(tag)).length;
      const sharedCount = actTags.filter((tag) => activityTags.includes(tag)).length;
      return {
        activity,
        score: preferredCount * 3 + sharedCount * 2 + (activity.user_rating || 0)
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return scored.map(({ activity }) => ({
    originalActivity: currentActivity,
    suggestedActivity: activity,
    reasoning: generateReasoning(contextChange, currentActivity, activity),
    relevanceScore: calculateRelevanceScore(currentActivity, activity, rule.preferredTags),
    preservedTags: (currentActivity.experiential_tags || []).filter((tag) => (activity.experiential_tags || []).includes(tag))
  }));
}

async function checkConflicts(currentActivity, rawContextChange, destination, excludeIds = []) {
  const contextChange = normalizeContextChange(rawContextChange);
  const rule = CONFLICT_RULES[contextChange.type] || CONFLICT_RULES.venue_closed;
  const activityTags = currentActivity.experiential_tags || [];
  const conflictingTags = rule.conflictingTags || [];
  const hasConflictingTags = activityTags.some((tag) => conflictingTags.includes(tag));
  const hasConflict = contextChange.type === 'venue_closed' || contextChange.type === 'user_hungry' || hasConflictingTags;

  if (!hasConflict) {
    return {
      hasConflict: false,
      contextChange,
      currentActivity,
      suggestions: [],
      estimatedImpact: 'No impact - your current activity is still a good fit.'
    };
  }

  return {
    hasConflict: true,
    contextChange,
    currentActivity,
    suggestions: await findAlternatives(currentActivity, contextChange, destination, excludeIds),
    estimatedImpact: rule.impact
  };
}

module.exports = { normalizeContextChange, checkConflicts };
