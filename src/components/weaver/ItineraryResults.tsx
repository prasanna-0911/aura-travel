import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  MapPin,
  Clock,
  IndianRupee,
  Star,
  Calendar,
  Sun,
  Sunset,
  Moon,
  Hotel,
  Utensils,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Sparkles,
  Share2,
  Download,
  Play,
  Navigation
} from 'lucide-react';
import { GeneratedItinerary } from '@/services/weaverService';
import { startTrip } from '@/services/tripService';
import { ItineraryMap } from '@/components/maps';
import { cn } from '@/utils/cn';

interface ItineraryResultsProps {
  itinerary: GeneratedItinerary;
  onReset: () => void;
}

export function ItineraryResults({ itinerary, onReset }: ItineraryResultsProps) {
  const [expandedDays, setExpandedDays] = useState<number[]>([1]);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'map' | 'hotel' | 'restaurants'>('itinerary');

  const toggleDay = (day: number) => {
    setExpandedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  const getTimeSlotIcon = (slot: string) => {
    switch (slot) {
      case 'morning': return Sun;
      case 'afternoon': return Sunset;
      case 'evening': return Moon;
      default: return Sun;
    }
  };

  const getTimeSlotColor = (slot: string) => {
    switch (slot) {
      case 'morning': return 'bg-amber-100 text-amber-700';
      case 'afternoon': return 'bg-orange-100 text-orange-700';
      case 'evening': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleStartTrip = () => {
    void startTrip(itinerary);
  };

  return (
    <div className="min-h-screen bg-pearl">
      {/* Header */}
      <div className="bg-midnight text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Back Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-2 text-white/70 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Create new itinerary</span>
          </button>

          {/* Title Section */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-eucalyptus" />
                <span className="text-eucalyptus text-sm font-medium">AI Generated Itinerary</span>
              </div>
              <h1 
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {itinerary.duration} Days in {itinerary.destination}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {itinerary.duration} days
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {itinerary.days.reduce((acc, day) => acc + day.activities.length, 0)} activities
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  Est. ₹{itinerary.totalCost.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Generated in {itinerary.generationTime}s
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Share">
                <Share2 className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors" title="Download PDF">
                <Download className="w-5 h-5" />
              </button>
              <Link
                to="/live-trip"
                onClick={handleStartTrip}
                className="flex items-center gap-2 px-4 py-2 bg-eucalyptus hover:bg-eucalyptus-dark rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                Start Trip
              </Link>
            </div>
          </div>

          {/* Matched Tags */}
          {itinerary.matchedTags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {itinerary.matchedTags.slice(0, 8).map((tag, index) => (
                <span 
                  key={index}
                  className="px-2.5 py-1 bg-white/10 rounded-full text-xs text-white/80"
                >
                  {tag}
                </span>
              ))}
              {itinerary.matchedTags.length > 8 && (
                <span className="px-2.5 py-1 text-xs text-white/60">
                  +{itinerary.matchedTags.length - 8} more
                </span>
              )}
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 border-b border-white/10">
            {[
              { id: 'itinerary', label: 'Itinerary', icon: Calendar },
              { id: 'map', label: 'Route Map', icon: Navigation },
              { id: 'hotel', label: 'Accommodation', icon: Hotel },
              { id: 'restaurants', label: 'Restaurants', icon: Utensils },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={cn(
                  "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px",
                  activeTab === tab.id
                    ? "text-white border-eucalyptus"
                    : "text-white/60 hover:text-white border-transparent"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Itinerary Tab */}
        {activeTab === 'itinerary' && (
          <div className="space-y-4">
            {itinerary.days.map((day) => (
              <div 
                key={day.day}
                className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden"
              >
                {/* Day Header */}
                <button
                  onClick={() => toggleDay(day.day)}
                  className="w-full flex items-center justify-between p-5 hover:bg-sandstone/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-eucalyptus/10 flex items-center justify-center">
                      <span className="text-eucalyptus font-bold text-lg">{day.day}</span>
                    </div>
                    <div className="text-left">
                      <h3 
                        className="text-lg font-semibold text-midnight"
                        style={{ fontFamily: 'var(--font-heading)' }}
                      >
                        Day {day.day}
                      </h3>
                      <p className="text-sm text-midnight/60">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                        <span className="mx-2">•</span>
                        {day.activities.length} activities
                      </p>
                    </div>
                  </div>
                  {expandedDays.includes(day.day) ? (
                    <ChevronUp className="w-5 h-5 text-midnight/40" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-midnight/40" />
                  )}
                </button>

                {/* Day Activities */}
                {expandedDays.includes(day.day) && (
                  <div className="border-t border-sandstone/50">
                    {day.activities.map((item, index) => {
                      const TimeIcon = getTimeSlotIcon(item.timeSlot);
                      return (
                        <div 
                          key={index}
                          className={cn(
                            "p-5 flex gap-4",
                            index !== day.activities.length - 1 && "border-b border-sandstone/30"
                          )}
                        >
                          {/* Time Slot */}
                          <div className="flex flex-col items-center">
                            <div className={cn(
                              "w-10 h-10 rounded-lg flex items-center justify-center",
                              getTimeSlotColor(item.timeSlot)
                            )}>
                              <TimeIcon className="w-5 h-5" />
                            </div>
                            <span className="text-xs text-midnight/50 mt-1">{item.scheduledTime}</span>
                          </div>

                          {/* Activity Details */}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex-1">
                                <h4 className="font-semibold text-midnight mb-1">
                                  {item.activity.name}
                                </h4>
                                <p className="text-sm text-midnight/60 mb-3 line-clamp-2">
                                  {item.activity.description}
                                </p>
                                <div className="flex flex-wrap items-center gap-3 text-sm">
                                  <span className="flex items-center gap-1 text-midnight/60">
                                    <Clock className="w-3.5 h-3.5" />
                                    {item.activity.duration_hours}h
                                  </span>
                                  <span className="flex items-center gap-1 text-midnight/60">
                                    <IndianRupee className="w-3.5 h-3.5" />
                                    {item.activity.cost_inr === 0 ? 'Free' : `₹${item.activity.cost_inr}`}
                                  </span>
                                  <span className="flex items-center gap-1 text-midnight/60">
                                    <Star className="w-3.5 h-3.5 text-amber-500" />
                                    {item.activity.user_rating}
                                  </span>
                                  <span className="flex items-center gap-1 text-midnight/60">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {item.activity.location.address.split(',')[0]}
                                  </span>
                                </div>
                                {/* Tags */}
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                  {item.activity.experiential_tags.slice(0, 4).map((tag, i) => (
                                    <span 
                                      key={i}
                                      className="px-2 py-0.5 bg-sandstone/50 rounded text-xs text-midnight/60"
                                    >
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              {/* Activity Image */}
                              <div className="hidden sm:block w-32 h-24 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={item.activity.images[0]} 
                                  alt={item.activity.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Map Tab */}
        {activeTab === 'map' && (
          <div className="space-y-6">
            {/* Full Trip Map */}
            <ItineraryMap 
              activities={itinerary.days.flatMap(day => day.activities)}
              destination={itinerary.destination}
            />
            
            {/* Individual Day Maps */}
            {itinerary.days.length > 1 && (
              <div className="space-y-4">
                <h3 
                  className="text-lg font-semibold text-midnight"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Day-by-Day Routes
                </h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {itinerary.days.map((day) => (
                    <ItineraryMap 
                      key={day.day}
                      activities={day.activities}
                      destination={itinerary.destination}
                      day={day.day}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Hotel Tab */}
        {activeTab === 'hotel' && itinerary.hotel && (
          <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
            <div className="md:flex">
              {/* Hotel Image */}
              <div className="md:w-1/3 h-64 md:h-auto">
                <img 
                  src={itinerary.hotel.images[0]} 
                  alt={itinerary.hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hotel Details */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      {Array.from({ length: itinerary.hotel.star_rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-500 fill-amber-500" />
                      ))}
                    </div>
                    <h2 
                      className="text-2xl font-bold text-midnight"
                      style={{ fontFamily: 'var(--font-heading)' }}
                    >
                      {itinerary.hotel.name}
                    </h2>
                    <p className="text-midnight/60 flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {itinerary.hotel.location.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-eucalyptus">
                      ₹{itinerary.hotel.price_per_night.toLocaleString()}
                    </p>
                    <p className="text-sm text-midnight/60">per night</p>
                  </div>
                </div>

                <p className="text-midnight/70 mb-4">
                  {itinerary.hotel.description}
                </p>

                {/* Amenities */}
                <div className="mb-4">
                  <h4 className="font-medium text-midnight mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {itinerary.hotel.amenities.map((amenity, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-sandstone/50 rounded-full text-sm text-midnight/70"
                      >
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {itinerary.hotel.experiential_tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2.5 py-1 bg-eucalyptus/10 text-eucalyptus rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="mt-6 pt-6 border-t border-sandstone/50 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                    <span className="font-semibold text-midnight">{itinerary.hotel.user_rating}</span>
                    <span className="text-midnight/60">rating</span>
                  </div>
                  <Link
                    to="/bookings"
                    className="flex items-center gap-2 px-6 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white rounded-lg font-medium transition-colors"
                  >
                    Book Now
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Restaurants Tab */}
        {activeTab === 'restaurants' && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {itinerary.recommendedRestaurants.map((restaurant) => (
              <div 
                key={restaurant.id}
                className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Image */}
                <div className="h-40 overflow-hidden">
                  <img 
                    src={restaurant.images[0]} 
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-midnight">{restaurant.name}</h3>
                    <span className="flex items-center gap-1 text-sm">
                      <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                      {restaurant.user_rating}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-midnight/60 mb-3">
                    <span>{restaurant.cuisine.slice(0, 2).join(', ')}</span>
                    <span>•</span>
                    <span>{restaurant.price_range}</span>
                  </div>

                  <p className="text-sm text-midnight/60 line-clamp-2 mb-3">
                    {restaurant.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-midnight/50">
                      ~₹{restaurant.avg_cost_per_person} per person
                    </span>
                    <span className="text-xs px-2 py-1 bg-eucalyptus/10 text-eucalyptus rounded-full">
                      {restaurant.best_for}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
