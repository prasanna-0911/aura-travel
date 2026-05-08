import { MapPin, Navigation, Clock, Calendar } from 'lucide-react';
import { GeneratedItinerary } from '@/services/weaverService';

interface TripOverviewMapProps {
  itinerary: GeneratedItinerary;
}

// Destination images for mini-map background
const DESTINATION_IMAGES: Record<string, string> = {
  'Goa': 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
  'Manali': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
  'Pune': 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop'
};

export function TripOverviewMap({ itinerary }: TripOverviewMapProps) {
  const totalActivities = itinerary.days.reduce((sum, day) => sum + day.activities.length, 0);
  const totalHours = itinerary.days.reduce((sum, day) => 
    sum + day.activities.reduce((daySum, a) => daySum + a.activity.duration_hours, 0), 0
  );
  
  // Get all unique categories
  const categories = [...new Set(
    itinerary.days.flatMap(day => 
      day.activities.map(a => a.activity.category)
    )
  )];

  return (
    <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
      {/* Mini Map Header */}
      <div 
        className="relative h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${DESTINATION_IMAGES[itinerary.destination]})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 to-transparent" />
        
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-white/80 text-xs mb-1">
              <Navigation className="w-3 h-3" />
              <span>Trip Overview</span>
            </div>
            <h3 className="text-white font-semibold" style={{ fontFamily: 'var(--font-heading)' }}>
              {itinerary.destination} Journey
            </h3>
          </div>
          
          <div className="flex items-center gap-1 px-2 py-1 bg-white/20 backdrop-blur-sm rounded-lg">
            <MapPin className="w-3 h-3 text-white" />
            <span className="text-xs text-white">{totalActivities} stops</span>
          </div>
        </div>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-px bg-sandstone/50">
        <div className="bg-white p-3 text-center">
          <Calendar className="w-4 h-4 text-eucalyptus mx-auto mb-1" />
          <p className="text-lg font-bold text-midnight">{itinerary.duration}</p>
          <p className="text-xs text-midnight/60">Days</p>
        </div>
        <div className="bg-white p-3 text-center">
          <MapPin className="w-4 h-4 text-eucalyptus mx-auto mb-1" />
          <p className="text-lg font-bold text-midnight">{totalActivities}</p>
          <p className="text-xs text-midnight/60">Activities</p>
        </div>
        <div className="bg-white p-3 text-center">
          <Clock className="w-4 h-4 text-eucalyptus mx-auto mb-1" />
          <p className="text-lg font-bold text-midnight">{totalHours}</p>
          <p className="text-xs text-midnight/60">Hours</p>
        </div>
      </div>
      
      {/* Categories */}
      <div className="p-4 border-t border-sandstone/50">
        <p className="text-xs text-midnight/60 mb-2">Experience Types</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat, i) => (
            <span 
              key={i}
              className="px-2 py-1 bg-eucalyptus/10 text-eucalyptus rounded text-xs capitalize"
            >
              {cat}
            </span>
          ))}
        </div>
      </div>
      
      {/* Day Timeline */}
      <div className="p-4 border-t border-sandstone/50">
        <p className="text-xs text-midnight/60 mb-3">Daily Route</p>
        <div className="space-y-2">
          {itinerary.days.map((day) => (
            <div key={day.day} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-eucalyptus/10 flex items-center justify-center">
                <span className="text-xs font-bold text-eucalyptus">{day.day}</span>
              </div>
              <div className="flex-1 flex items-center gap-1">
                {day.activities.map((a, i) => (
                  <div key={i} className="flex items-center">
                    <div 
                      className="w-2 h-2 rounded-full bg-eucalyptus"
                      title={a.activity.name}
                    />
                    {i < day.activities.length - 1 && (
                      <div className="w-4 h-px bg-sandstone" />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-xs text-midnight/40">
                {day.activities.length} stops
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
