import { Activity, activities } from '@/data';
import { GeneratedItinerary } from './weaverService';
import { apiRequest } from './apiClient';

// Context change types that can trigger replanning
export type ContextChangeType = 
  | 'weather_rain'
  | 'weather_hot'
  | 'overcrowding'
  | 'user_tired'
  | 'user_hungry'
  | 'running_late'
  | 'venue_closed';

export interface ContextChange {
  type: ContextChangeType;
  severity: 'low' | 'medium' | 'high';
  timestamp: Date;
}

export interface ConflictSuggestion {
  originalActivity: Activity;
  suggestedActivity: Activity;
  reasoning: string;
  relevanceScore: number;
  preservedTags: string[];
}

export interface ConflictResult {
  hasConflict: boolean;
  contextChange: ContextChange | null;
  currentActivity: Activity | null;
  suggestions: ConflictSuggestion[];
  estimatedImpact: string;
}

// Conflict rules based on context changes
const CONFLICT_RULES: Record<ContextChangeType, {
  conflictingTags: string[];
  preferredTags: string[];
  description: string;
  impact: string;
}> = {
  weather_rain: {
    conflictingTags: ['outdoors', 'beach', 'hiking', 'water-sports', 'outdoor', 'trekking'],
    preferredTags: ['indoors', 'indoor', 'cultural', 'shopping', 'food', 'wellness', 'spa'],
    description: 'Rain detected in the area',
    impact: 'Outdoor activities may be affected'
  },
  weather_hot: {
    conflictingTags: ['hiking', 'trekking', 'adventure', 'outdoors'],
    preferredTags: ['indoors', 'indoor', 'beach', 'water-sports', 'wellness', 'spa', 'pool'],
    description: 'Extreme heat warning',
    impact: 'Strenuous outdoor activities not recommended'
  },
  overcrowding: {
    conflictingTags: ['popular', 'touristy'],
    preferredTags: ['secluded', 'peaceful', 'offbeat', 'quiet', 'hidden'],
    description: 'High crowd levels at venue',
    impact: 'Long wait times and crowded experience expected'
  },
  user_tired: {
    conflictingTags: ['adventurous', 'hiking', 'trekking', 'thrilling', 'adventure', 'challenging'],
    preferredTags: ['relaxing', 'peaceful', 'wellness', 'spa', 'leisure', 'easy-access'],
    description: 'You seem tired',
    impact: 'High-energy activities may be exhausting'
  },
  user_hungry: {
    conflictingTags: [],
    preferredTags: ['food', 'culinary', 'dining', 'cultural'],
    description: 'Meal time detected',
    impact: 'Consider dining before the next activity'
  },
  running_late: {
    conflictingTags: ['long-duration'],
    preferredTags: ['quick', 'nearby', 'easy-access'],
    description: 'Running behind schedule',
    impact: 'May need to skip or shorten activities'
  },
  venue_closed: {
    conflictingTags: [],
    preferredTags: [],
    description: 'Venue unexpectedly closed',
    impact: 'Need to find an alternative activity'
  }
};

// Generate reasoning text for suggestion
function generateReasoning(
  contextChange: ContextChange,
  original: Activity,
  suggested: Activity
): string {
  // Access rule to suppress unused warning (for potential future use)
  void CONFLICT_RULES[contextChange.type];
  
  switch (contextChange.type) {
    case 'weather_rain':
      return `It's raining! Instead of "${original.name}" (outdoors), we suggest "${suggested.name}" - a great indoor alternative that matches your ${suggested.experiential_tags.slice(0, 2).join(' and ')} preferences.`;
    
    case 'weather_hot':
      return `It's extremely hot outside. Skip the strenuous "${original.name}" and enjoy "${suggested.name}" instead - stay cool while having a great experience!`;
    
    case 'overcrowding':
      return `"${original.name}" is very crowded right now. We found "${suggested.name}" - a similar ${suggested.category} experience without the crowds.`;
    
    case 'user_tired':
      return `Feeling tired? Instead of the active "${original.name}", relax with "${suggested.name}" - a more laid-back option that still captures the essence of your trip.`;
    
    case 'user_hungry':
      return `Time for a meal break! Near "${original.name}", you can enjoy "${suggested.name}" before continuing your adventure.`;
    
    case 'running_late':
      return `You're running behind schedule. "${suggested.name}" is quicker and nearby - perfect to keep your day on track.`;
    
    case 'venue_closed':
      return `"${original.name}" is unexpectedly closed. Don't worry - "${suggested.name}" is available and matches your interests!`;
    
    default:
      return `Based on current conditions, we recommend "${suggested.name}" as a great alternative to "${original.name}".`;
  }
}

// Calculate how well the alternative preserves the original intent
function calculateRelevanceScore(
  original: Activity,
  suggested: Activity,
  preferredTags: string[]
): number {
  // Base score from shared tags
  const sharedTags = original.experiential_tags.filter(tag => 
    suggested.experiential_tags.includes(tag)
  );
  const tagScore = sharedTags.length / original.experiential_tags.length;
  
  // Bonus for having preferred tags
  const preferredTagCount = suggested.experiential_tags.filter(tag =>
    preferredTags.includes(tag)
  ).length;
  const preferredBonus = Math.min(preferredTagCount * 0.1, 0.3);
  
  // Same category bonus
  const categoryBonus = original.category === suggested.category ? 0.15 : 0;
  
  // Rating factor
  const ratingFactor = suggested.user_rating / 5 * 0.15;
  
  // Calculate final score
  const score = Math.min(tagScore + preferredBonus + categoryBonus + ratingFactor, 1);
  
  return Math.round(score * 100) / 100;
}

// Find alternative activities based on context change
export function findAlternatives(
  currentActivity: Activity,
  contextChange: ContextChange,
  destination: string,
  excludeIds: string[] = []
): ConflictSuggestion[] {
  const rule = CONFLICT_RULES[contextChange.type];
  
  // Get all activities in the same destination
  const destinationActivities = activities.filter(a => 
    a.destination === destination && 
    a.id !== currentActivity.id &&
    !excludeIds.includes(a.id)
  );
  
  // Filter out activities with conflicting tags
  const nonConflictingActivities = destinationActivities.filter(a =>
    !a.experiential_tags.some(tag => rule.conflictingTags.includes(tag))
  );
  
  // Score activities based on:
  // 1. Preferred tags presence
  // 2. Similarity to original activity
  // 3. User rating
  const scoredActivities = nonConflictingActivities.map(activity => {
    const preferredTagCount = activity.experiential_tags.filter(tag =>
      rule.preferredTags.includes(tag)
    ).length;
    
    const sharedTagCount = activity.experiential_tags.filter(tag =>
      currentActivity.experiential_tags.includes(tag)
    ).length;
    
    const score = (preferredTagCount * 3) + (sharedTagCount * 2) + (activity.user_rating);
    
    return { activity, score };
  }).sort((a, b) => b.score - a.score);
  
  // Return top 3 suggestions
  return scoredActivities.slice(0, 3).map(({ activity }) => ({
    originalActivity: currentActivity,
    suggestedActivity: activity,
    reasoning: generateReasoning(contextChange, currentActivity, activity),
    relevanceScore: calculateRelevanceScore(currentActivity, activity, rule.preferredTags),
    preservedTags: currentActivity.experiential_tags.filter(tag =>
      activity.experiential_tags.includes(tag)
    )
  }));
}

// Check for conflicts based on context change
export function checkConflicts(
  currentActivity: Activity,
  contextChange: ContextChange,
  destination: string
): ConflictResult {
  const rule = CONFLICT_RULES[contextChange.type];
  
  // Check if current activity has conflicting tags
  const hasConflictingTags = currentActivity.experiential_tags.some(tag =>
    rule.conflictingTags.includes(tag)
  );
  
  // For venue_closed, always return conflict
  const hasConflict = contextChange.type === 'venue_closed' || hasConflictingTags;
  
  if (!hasConflict) {
    return {
      hasConflict: false,
      contextChange,
      currentActivity,
      suggestions: [],
      estimatedImpact: 'No impact - your activity is not affected by current conditions.'
    };
  }
  
  // Find alternatives
  const suggestions = findAlternatives(currentActivity, contextChange, destination);
  
  return {
    hasConflict: true,
    contextChange,
    currentActivity,
    suggestions,
    estimatedImpact: rule.impact
  };
}

export async function checkConflictsRemote(
  currentActivity: Activity,
  contextChange: ContextChange,
  destination: string
): Promise<ConflictResult> {
  try {
    const response = await apiRequest<ConflictResult & { success: boolean; conflict: boolean }>('/sync/check-conflicts', {
      method: 'POST',
      body: JSON.stringify({
        currentActivity,
        contextChange,
        destination
      })
    });

    return {
      hasConflict: response.hasConflict ?? response.conflict,
      contextChange: response.contextChange,
      currentActivity: response.currentActivity,
      suggestions: response.suggestions || [],
      estimatedImpact: response.estimatedImpact
    };
  } catch (error) {
    console.warn('Using local sync fallback:', error);
    return checkConflicts(currentActivity, contextChange, destination);
  }
}

// Live trip state management
export interface LiveTripState {
  itinerary: GeneratedItinerary;
  currentDayIndex: number;
  currentActivityIndex: number;
  startedAt: Date;
  status: 'active' | 'paused' | 'completed';
  completedActivities: string[];
  skippedActivities: string[];
  suggestionsHistory: {
    timestamp: Date;
    contextChange: ContextChange;
    suggestion: ConflictSuggestion;
    action: 'accepted' | 'declined' | 'pending';
  }[];
}

// Create a new live trip state
export function createLiveTripState(itinerary: GeneratedItinerary): LiveTripState {
  return {
    itinerary,
    currentDayIndex: 0,
    currentActivityIndex: 0,
    startedAt: new Date(),
    status: 'active',
    completedActivities: [],
    skippedActivities: [],
    suggestionsHistory: []
  };
}

// Get current activity from live trip state
export function getCurrentActivity(state: LiveTripState): Activity | null {
  const currentDay = state.itinerary.days[state.currentDayIndex];
  if (!currentDay) return null;
  
  const currentActivitySlot = currentDay.activities[state.currentActivityIndex];
  if (!currentActivitySlot) return null;
  
  return currentActivitySlot.activity;
}

// Get next activity from live trip state
export function getNextActivity(state: LiveTripState): Activity | null {
  const currentDay = state.itinerary.days[state.currentDayIndex];
  if (!currentDay) return null;
  
  // Check next in current day
  if (state.currentActivityIndex + 1 < currentDay.activities.length) {
    return currentDay.activities[state.currentActivityIndex + 1].activity;
  }
  
  // Check first in next day
  const nextDay = state.itinerary.days[state.currentDayIndex + 1];
  if (nextDay && nextDay.activities.length > 0) {
    return nextDay.activities[0].activity;
  }
  
  return null;
}

// Advance to next activity
export function advanceToNextActivity(state: LiveTripState): LiveTripState {
  const currentDay = state.itinerary.days[state.currentDayIndex];
  
  // Mark current as completed
  const currentActivity = getCurrentActivity(state);
  const newCompletedActivities = currentActivity 
    ? [...state.completedActivities, currentActivity.id]
    : state.completedActivities;
  
  // Check if there's another activity in current day
  if (state.currentActivityIndex + 1 < currentDay.activities.length) {
    return {
      ...state,
      currentActivityIndex: state.currentActivityIndex + 1,
      completedActivities: newCompletedActivities
    };
  }
  
  // Move to next day
  if (state.currentDayIndex + 1 < state.itinerary.days.length) {
    return {
      ...state,
      currentDayIndex: state.currentDayIndex + 1,
      currentActivityIndex: 0,
      completedActivities: newCompletedActivities
    };
  }
  
  // Trip completed
  return {
    ...state,
    status: 'completed',
    completedActivities: newCompletedActivities
  };
}

// Replace current activity with suggestion
export function replaceActivityWithSuggestion(
  state: LiveTripState,
  suggestion: ConflictSuggestion
): LiveTripState {
  const newDays = [...state.itinerary.days];
  const currentDay = { ...newDays[state.currentDayIndex] };
  const currentActivities = [...currentDay.activities];
  
  // Replace the activity
  currentActivities[state.currentActivityIndex] = {
    ...currentActivities[state.currentActivityIndex],
    activity: suggestion.suggestedActivity
  };
  
  currentDay.activities = currentActivities;
  newDays[state.currentDayIndex] = currentDay;
  
  return {
    ...state,
    itinerary: {
      ...state.itinerary,
      days: newDays
    },
    skippedActivities: [...state.skippedActivities, suggestion.originalActivity.id],
    suggestionsHistory: [
      ...state.suggestionsHistory,
      {
        timestamp: new Date(),
        contextChange: { type: 'weather_rain', severity: 'medium', timestamp: new Date() },
        suggestion,
        action: 'accepted'
      }
    ]
  };
}

// Get trip progress percentage
export function getTripProgress(state: LiveTripState): number {
  const totalActivities = state.itinerary.days.reduce(
    (sum, day) => sum + day.activities.length, 0
  );
  
  if (totalActivities === 0) return 0;
  
  const completed = state.completedActivities.length;
  return Math.round((completed / totalActivities) * 100);
}

// Context change display info
export const CONTEXT_CHANGE_INFO: Record<ContextChangeType, {
  icon: string;
  label: string;
  color: string;
  bgColor: string;
}> = {
  weather_rain: {
    icon: '🌧️',
    label: 'Rain Alert',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50'
  },
  weather_hot: {
    icon: '🌡️',
    label: 'Heat Warning',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50'
  },
  overcrowding: {
    icon: '👥',
    label: 'Overcrowding',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50'
  },
  user_tired: {
    icon: '😴',
    label: 'Energy Low',
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  user_hungry: {
    icon: '🍽️',
    label: 'Meal Time',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  },
  running_late: {
    icon: '⏰',
    label: 'Running Late',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  },
  venue_closed: {
    icon: '🚫',
    label: 'Venue Closed',
    color: 'text-red-600',
    bgColor: 'bg-red-50'
  }
};
