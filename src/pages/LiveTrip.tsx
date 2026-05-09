import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  RefreshCw,
  SkipForward,
  MapPin,
  Clock,
  Star,
  IndianRupee,
  ChevronRight,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Navigation,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Zap,
  Settings,
  Info
} from 'lucide-react';
import {
  LiveTripState,
  createLiveTripState,
  getCurrentActivity,
  getNextActivity,
  advanceToNextActivity,
  checkConflictsRemote,
  replaceActivityWithSuggestion,
  getTripProgress,
  ContextChange,
  ContextChangeType,
  ConflictResult,
  ConflictSuggestion,
  CONTEXT_CHANGE_INFO
} from '@/services/syncService';
import { generateItinerary, GeneratedItinerary } from '@/services/weaverService';
import { extractFromQuery } from '@/utils/nlp';
import { cn } from '@/utils/cn';
import { toast } from '@/components/notifications/Toast';

// Demo itinerary queries for quick start
const DEMO_QUERIES = [
  { label: 'Beach Getaway', query: 'peaceful beach trip with cultural experiences for 3 days in Goa' },
  { label: 'Mountain Adventure', query: 'adventurous mountain trip with hiking for 3 days in Manali' },
  { label: 'City Explorer', query: 'cultural heritage tour with food experiences for 2 days in Pune' }
];

// Simulation scenarios
const SIMULATION_SCENARIOS: {
  type: ContextChangeType;
  label: string;
  icon: string;
  description: string;
}[] = [
  { type: 'weather_rain', label: 'Simulate Rain', icon: '🌧️', description: 'Heavy rain starts falling' },
  { type: 'weather_hot', label: 'Heat Wave', icon: '🌡️', description: 'Temperature exceeds 40°C' },
  { type: 'overcrowding', label: 'Overcrowding', icon: '👥', description: 'Venue is very crowded' },
  { type: 'user_tired', label: 'Feeling Tired', icon: '😴', description: 'Low energy detected' },
  { type: 'venue_closed', label: 'Venue Closed', icon: '🚫', description: 'Unexpected closure' }
];

export function LiveTrip() {
  const [tripState, setTripState] = useState<LiveTripState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSimControls, setShowSimControls] = useState(false);
  const [conflictResult, setConflictResult] = useState<ConflictResult | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationTimeout, setNotificationTimeout] = useState<NodeJS.Timeout | null>(null);

  // Load demo trip on mount (for demo purposes)
  useEffect(() => {
    // Check if there's a stored itinerary
    const storedItinerary = localStorage.getItem('aura_current_itinerary');
    if (storedItinerary) {
      try {
        const itinerary = JSON.parse(storedItinerary) as GeneratedItinerary;
        setTripState(createLiveTripState(itinerary));
      } catch (e) {
        // Invalid stored data
        localStorage.removeItem('aura_current_itinerary');
      }
    }
  }, []);

  // Start a demo trip
  const startDemoTrip = async (query: string) => {
    setIsLoading(true);
    try {
      const nlpResult = extractFromQuery(query);
      const itinerary = await generateItinerary(nlpResult);
      const newTripState = createLiveTripState(itinerary);
      setTripState(newTripState);
      localStorage.setItem('aura_current_itinerary', JSON.stringify(itinerary));
    } catch (error) {
      console.error('Error starting demo trip:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle simulation trigger
  const triggerSimulation = async (type: ContextChangeType) => {
    if (!tripState) return;

    const currentActivity = getCurrentActivity(tripState);
    if (!currentActivity) return;

    const contextChange: ContextChange = {
      type,
      severity: 'medium',
      timestamp: new Date()
    };

    const result = await checkConflictsRemote(
      currentActivity,
      contextChange,
      tripState.itinerary.destination
    );

    setConflictResult(result);
    
    if (result.hasConflict && result.suggestions.length > 0) {
      setShowNotification(true);
      
      // Clear any existing timeout
      if (notificationTimeout) {
        clearTimeout(notificationTimeout);
      }
      
      // Auto-dismiss after 30 seconds
      const timeout = setTimeout(() => {
        setShowNotification(false);
      }, 30000);
      setNotificationTimeout(timeout);
    }
  };

  // Accept suggestion
  const acceptSuggestion = (suggestion: ConflictSuggestion) => {
    if (!tripState) return;

    const newState = replaceActivityWithSuggestion(tripState, suggestion);
    setTripState(newState);
    setShowNotification(false);
    setConflictResult(null);

    toast.success('Activity Replaced', `Switched to ${suggestion.suggestedActivity.name}`);

    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
  };

  // Decline suggestion
  const declineSuggestion = () => {
    setShowNotification(false);
    setConflictResult(null);

    toast.info('Kept Original Plan', 'Your itinerary remains unchanged.');

    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }
  };

  // Mark activity as complete and move to next
  const completeActivity = () => {
    if (!tripState) return;
    const newState = advanceToNextActivity(tripState);
    const completedName = getCurrentActivity(tripState)?.name;
    setTripState(newState);

    if (completedName) {
      toast.success('Activity Completed', `"${completedName}" marked as done!`);
    }
  };

  // End trip
  const endTrip = () => {
    setTripState(null);
    localStorage.removeItem('aura_current_itinerary');
  };

  // Get time slot icon
  const getTimeSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning': return Sun;
      case 'afternoon': return Sunset;
      case 'evening': return Moon;
      default: return Sun;
    }
  };

  // If no active trip, show start screen
  if (!tripState) {
    return (
      <div className="min-h-screen bg-pearl">
        {/* Header */}
        <section className="hero-gradient pt-12 pb-8 md:pt-20 md:pb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember/10 rounded-full mb-6">
              <RefreshCw className="w-4 h-4 text-ember" />
              <span className="text-sm font-medium text-ember">AI Travel Sync</span>
            </div>

            <h1 
              className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Live Trip Tracking
            </h1>

            <p className="text-midnight/60 text-lg max-w-2xl mx-auto mb-8">
              Experience real-time trip adaptation. Our AI monitors conditions and proactively 
              suggests alternatives when things change – weather, crowds, or your energy levels.
            </p>
          </div>
        </section>

        {/* Demo Options */}
        <section className="py-12">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-xl shadow-midnight/5 border border-sandstone/50 overflow-hidden">
              <div className="p-6 border-b border-sandstone/50">
                <h2 
                  className="text-xl font-semibold text-midnight mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Start a Demo Trip
                </h2>
                <p className="text-midnight/60 text-sm">
                  Choose a pre-configured trip to experience AI Travel Sync features:
                </p>
              </div>

              <div className="p-6 space-y-4">
                {DEMO_QUERIES.map((demo, index) => (
                  <button
                    key={index}
                    onClick={() => startDemoTrip(demo.query)}
                    disabled={isLoading}
                    className="w-full flex items-center justify-between p-4 bg-sandstone/20 hover:bg-sandstone/40 rounded-xl transition-colors group disabled:opacity-50"
                  >
                    <div className="text-left">
                      <h3 className="font-medium text-midnight group-hover:text-eucalyptus transition-colors">
                        {demo.label}
                      </h3>
                      <p className="text-sm text-midnight/60 line-clamp-1">
                        "{demo.query}"
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-midnight/30 group-hover:text-eucalyptus group-hover:translate-x-1 transition-all" />
                  </button>
                ))}

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin w-6 h-6 border-2 border-eucalyptus border-t-transparent rounded-full" />
                    <span className="ml-3 text-midnight/60">Generating your trip...</span>
                  </div>
                )}
              </div>

              <div className="p-6 bg-sandstone/20 border-t border-sandstone/50">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-eucalyptus flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-midnight/70">
                      <strong>Or create your own itinerary first!</strong> Go to{' '}
                      <Link to="/weaver" className="text-eucalyptus hover:underline">
                        Experience Weaver
                      </Link>{' '}
                      to generate a custom trip, then click "Start Trip" to track it here.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {[
                { 
                  icon: AlertTriangle, 
                  title: 'Conflict Detection', 
                  desc: 'Automatically detects when conditions affect your plans'
                },
                { 
                  icon: Sparkles, 
                  title: 'Smart Suggestions', 
                  desc: 'AI finds alternatives that match your original preferences'
                },
                { 
                  icon: RefreshCw, 
                  title: 'Instant Updates', 
                  desc: 'Accept suggestions with one tap to update your itinerary'
                }
              ].map((feature, index) => (
                <div key={index} className="text-center p-6 bg-white rounded-xl border border-sandstone/50">
                  <div className="w-12 h-12 bg-ember/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-ember" />
                  </div>
                  <h3 className="font-semibold text-midnight mb-1">{feature.title}</h3>
                  <p className="text-sm text-midnight/60">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Active trip view
  const currentActivity = getCurrentActivity(tripState);
  const nextActivity = getNextActivity(tripState);
  const progress = getTripProgress(tripState);
  const currentDay = tripState.itinerary.days[tripState.currentDayIndex];
  const currentSlot = currentDay?.activities[tripState.currentActivityIndex];

  return (
    <div className="min-h-screen bg-pearl pb-24">
      {/* Trip Header */}
      <div className="bg-midnight text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm font-medium">Live Trip Active</span>
            </div>
            <button
              onClick={() => setShowSimControls(!showSimControls)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                showSimControls 
                  ? "bg-ember text-white" 
                  : "bg-white/10 text-white/70 hover:text-white"
              )}
            >
              <Settings className="w-4 h-4" />
              Simulation Controls
            </button>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {tripState.itinerary.destination} Adventure
              </h1>
              <div className="flex items-center gap-4 text-white/60 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Day {tripState.currentDayIndex + 1} of {tripState.itinerary.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Navigation className="w-4 h-4" />
                  {tripState.completedActivities.length} activities completed
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={endTrip}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
              >
                End Trip
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-white/60">Trip Progress</span>
              <span className="text-white font-medium">{progress}%</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-eucalyptus rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Simulation Controls Panel */}
        {showSimControls && (
          <div className="bg-midnight/50 border-t border-white/10 animate-fade-in">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center gap-2 mb-3">
                <Zap className="w-4 h-4 text-ember" />
                <span className="text-sm font-medium text-white">Demo Controls</span>
                <span className="text-xs text-white/50 ml-2">
                  (Simulate real-world scenarios to see AI Travel Sync in action)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {SIMULATION_SCENARIOS.map((scenario) => (
                  <button
                    key={scenario.type}
                    onClick={() => triggerSimulation(scenario.type)}
                    className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm transition-colors group"
                  >
                    <span className="text-lg">{scenario.icon}</span>
                    <span className="text-white/80 group-hover:text-white">{scenario.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Current Activity - Main Focus */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Activity Card */}
            {currentActivity && currentSlot && (
              <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden shadow-lg">
                <div className="relative h-48 md:h-64">
                  <img 
                    src={currentActivity.images[0]} 
                    alt={currentActivity.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
                  
                  {/* Status Badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-eucalyptus text-white rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Current Activity
                  </div>

                  {/* Time Slot */}
                  <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-sm">
                    {(() => {
                      const TimeIcon = getTimeSlotIcon(currentSlot.timeSlot);
                      return <TimeIcon className="w-4 h-4 text-amber-500" />;
                    })()}
                    <span className="text-midnight font-medium">{currentSlot.scheduledTime}</span>
                  </div>

                  {/* Activity Name */}
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="inline-block px-2 py-0.5 bg-white/20 backdrop-blur-sm rounded text-xs text-white mb-2 capitalize">
                      {currentActivity.category}
                    </span>
                    <h2 
                      className="text-2xl md:text-3xl font-bold text-white"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {currentActivity.name}
                    </h2>
                  </div>
                </div>

                {/* Activity Details */}
                <div className="p-6">
                  <p className="text-midnight/70 mb-4">
                    {currentActivity.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-midnight/60 mb-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {currentActivity.duration_hours}h duration
                    </span>
                    <span className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4" />
                      {currentActivity.cost_inr === 0 ? 'Free' : `₹${currentActivity.cost_inr}`}
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500" />
                      {currentActivity.user_rating} rating
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {currentActivity.location.address.split(',')[0]}
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {currentActivity.experiential_tags.slice(0, 5).map((tag, i) => (
                      <span 
                        key={i}
                        className="px-2.5 py-1 bg-sandstone/50 rounded-full text-xs text-midnight/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={completeActivity}
                      className="flex-1 flex items-center justify-center gap-2 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium rounded-xl transition-colors"
                    >
                      <Check className="w-5 h-5" />
                      Mark Complete
                    </button>
                    <button
                      onClick={completeActivity}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-sandstone/50 hover:bg-sandstone text-midnight font-medium rounded-xl transition-colors"
                    >
                      <SkipForward className="w-5 h-5" />
                      Skip
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Day Timeline */}
            <div className="bg-white rounded-2xl border border-sandstone/50 p-6">
              <h3 
                className="font-semibold text-midnight mb-4 flex items-center gap-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                <Calendar className="w-5 h-5 text-eucalyptus" />
                Day {tripState.currentDayIndex + 1} Timeline
              </h3>

              <div className="space-y-4">
                {currentDay?.activities.map((slot, index) => {
                  const isCompleted = tripState.completedActivities.includes(slot.activity.id);
                  const isCurrent = index === tripState.currentActivityIndex;
                  const TimeIcon = getTimeSlotIcon(slot.timeSlot);

                  return (
                    <div 
                      key={index}
                      className={cn(
                        "flex items-center gap-4 p-3 rounded-xl transition-colors",
                        isCurrent && "bg-eucalyptus/10 border border-eucalyptus/20",
                        isCompleted && "opacity-50"
                      )}
                    >
                      {/* Status Icon */}
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        isCompleted ? "bg-green-100 text-green-600" :
                        isCurrent ? "bg-eucalyptus text-white" :
                        "bg-sandstone/50 text-midnight/40"
                      )}>
                        {isCompleted ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <TimeIcon className="w-5 h-5" />
                        )}
                      </div>

                      {/* Activity Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-midnight/50">{slot.scheduledTime}</span>
                          {isCurrent && (
                            <span className="px-2 py-0.5 bg-eucalyptus text-white text-xs rounded-full">
                              Now
                            </span>
                          )}
                        </div>
                        <p className={cn(
                          "font-medium truncate",
                          isCompleted ? "text-midnight/50 line-through" : "text-midnight"
                        )}>
                          {slot.activity.name}
                        </p>
                      </div>

                      {/* Duration */}
                      <span className="text-sm text-midnight/50">
                        {slot.activity.duration_hours}h
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Next Up */}
            {nextActivity && (
              <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
                <div className="p-4 border-b border-sandstone/50 flex items-center gap-2">
                  <SkipForward className="w-4 h-4 text-eucalyptus" />
                  <h3 className="font-semibold text-midnight" style={{ fontFamily: 'var(--font-heading)' }}>
                    Up Next
                  </h3>
                </div>
                <div className="p-4">
                  <img 
                    src={nextActivity.images[0]} 
                    alt={nextActivity.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-midnight mb-1">{nextActivity.name}</h4>
                  <div className="flex items-center gap-3 text-sm text-midnight/60">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {nextActivity.duration_hours}h
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500" />
                      {nextActivity.user_rating}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Hotel Info */}
            {tripState.itinerary.hotel && (
              <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
                <div className="p-4 border-b border-sandstone/50 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-eucalyptus" />
                  <h3 className="font-semibold text-midnight" style={{ fontFamily: 'var(--font-heading)' }}>
                    Your Stay
                  </h3>
                </div>
                <div className="p-4">
                  <img 
                    src={tripState.itinerary.hotel.images[0]} 
                    alt={tripState.itinerary.hotel.name}
                    className="w-full h-24 object-cover rounded-lg mb-3"
                  />
                  <h4 className="font-medium text-midnight mb-1">{tripState.itinerary.hotel.name}</h4>
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({ length: tripState.itinerary.hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm text-midnight/60">
                    {tripState.itinerary.hotel.location.address.split(',').slice(0, 2).join(',')}
                  </p>
                </div>
              </div>
            )}

            {/* Trip Stats */}
            <div className="bg-sandstone/30 rounded-2xl p-4">
              <h3 className="font-semibold text-midnight mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                Trip Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-midnight/60">Completed</span>
                  <span className="font-medium text-midnight">{tripState.completedActivities.length} activities</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-midnight/60">Remaining</span>
                  <span className="font-medium text-midnight">
                    {tripState.itinerary.days.reduce((sum, day) => sum + day.activities.length, 0) - tripState.completedActivities.length} activities
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-midnight/60">Adaptations</span>
                  <span className="font-medium text-midnight">{tripState.suggestionsHistory.filter(s => s.action === 'accepted').length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conflict Notification Overlay */}
      {showNotification && conflictResult && conflictResult.suggestions.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-4 pointer-events-none">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-sandstone/50 overflow-hidden pointer-events-auto animate-fade-in-up">
            {/* Header */}
            <div className={cn(
              "p-4 flex items-center gap-3",
              CONTEXT_CHANGE_INFO[conflictResult.contextChange!.type].bgColor
            )}>
              <span className="text-2xl">
                {CONTEXT_CHANGE_INFO[conflictResult.contextChange!.type].icon}
              </span>
              <div className="flex-1">
                <h3 className={cn(
                  "font-semibold",
                  CONTEXT_CHANGE_INFO[conflictResult.contextChange!.type].color
                )}>
                  {CONTEXT_CHANGE_INFO[conflictResult.contextChange!.type].label}
                </h3>
                <p className="text-sm text-midnight/60">
                  {conflictResult.estimatedImpact}
                </p>
              </div>
              <button 
                onClick={declineSuggestion}
                className="p-2 hover:bg-black/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-midnight/40" />
              </button>
            </div>

            {/* Suggestion */}
            {conflictResult.suggestions[0] && (
              <div className="p-4">
                <div className="flex items-start gap-4 mb-4">
                  <img 
                    src={conflictResult.suggestions[0].suggestedActivity.images[0]}
                    alt={conflictResult.suggestions[0].suggestedActivity.name}
                    className="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                  />
                  <div>
                    <p className="text-sm text-midnight/60 mb-1">We suggest:</p>
                    <h4 className="font-semibold text-midnight">
                      {conflictResult.suggestions[0].suggestedActivity.name}
                    </h4>
                    <div className="flex items-center gap-3 mt-1 text-sm text-midnight/60">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {conflictResult.suggestions[0].suggestedActivity.duration_hours}h
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 text-amber-500" />
                        {conflictResult.suggestions[0].suggestedActivity.user_rating}
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-midnight/70 mb-4 p-3 bg-sandstone/30 rounded-lg">
                  {conflictResult.suggestions[0].reasoning}
                </p>

                {/* Preserved Tags */}
                {conflictResult.suggestions[0].preservedTags.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-midnight/50 mb-2">Preserved experience:</p>
                    <div className="flex flex-wrap gap-1">
                      {conflictResult.suggestions[0].preservedTags.slice(0, 4).map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 bg-eucalyptus/10 text-eucalyptus text-xs rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Match Score */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs text-midnight/50">Match Score:</span>
                  <div className="flex-1 h-1.5 bg-sandstone rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-eucalyptus rounded-full"
                      style={{ width: `${conflictResult.suggestions[0].relevanceScore * 100}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-eucalyptus">
                    {Math.round(conflictResult.suggestions[0].relevanceScore * 100)}%
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => acceptSuggestion(conflictResult.suggestions[0])}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium rounded-xl transition-colors"
                  >
                    <Check className="w-5 h-5" />
                    Accept
                  </button>
                  <button
                    onClick={declineSuggestion}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-sandstone/50 hover:bg-sandstone text-midnight font-medium rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5" />
                    Keep Original
                  </button>
                </div>

                {/* Other Suggestions */}
                {conflictResult.suggestions.length > 1 && (
                  <button className="w-full mt-3 text-center text-sm text-eucalyptus hover:text-eucalyptus-dark transition-colors">
                    See {conflictResult.suggestions.length - 1} more alternative{conflictResult.suggestions.length > 2 ? 's' : ''}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
