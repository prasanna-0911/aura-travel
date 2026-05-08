import { useMemo, useState } from 'react';
import * as L from 'leaflet';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { MapPin, Star, Clock, IndianRupee, Filter, X } from 'lucide-react';
import { Activity } from '@/data';
import { cn } from '@/utils/cn';

interface DestinationMapProps {
  activities: Activity[];
  destination: string;
  onActivitySelect?: (activity: Activity) => void;
}

const DESTINATION_CENTERS: Record<string, [number, number]> = {
  Goa: [15.4909, 73.8278],
  Manali: [32.2396, 77.1887],
  Pune: [18.5204, 73.8567]
};

const CATEGORY_CONFIG: Record<string, { color: string; label: string }> = {
  leisure: { color: '#4FA3A5', label: 'Leisure' },
  cultural: { color: '#8B5CF6', label: 'Cultural' },
  adventure: { color: '#E07A5F', label: 'Adventure' },
  wellness: { color: '#10B981', label: 'Wellness' },
  wildlife: { color: '#F59E0B', label: 'Wildlife' },
  shopping: { color: '#EC4899', label: 'Shopping' },
  nightlife: { color: '#6366F1', label: 'Nightlife' },
  food: { color: '#F97316', label: 'Food' },
  spiritual: { color: '#6366F1', label: 'Spiritual' }
};

function createMarkerIcon(activity: Activity) {
  const color = CATEGORY_CONFIG[activity.category]?.color || '#4FA3A5';
  return L.divIcon({
    className: 'aura-map-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
    html: `<div style="width:34px;height:34px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 10px 25px rgba(15,23,42,.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:700;">${activity.name.charAt(0)}</div>`
  });
}

export function DestinationMap({ activities, destination, onActivitySelect }: DestinationMapProps) {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  const center = DESTINATION_CENTERS[destination] || DESTINATION_CENTERS.Goa;
  const categories = useMemo(() => [...new Set(activities.map((activity) => activity.category))], [activities]);
  const filteredActivities = categoryFilter
    ? activities.filter((activity) => activity.category === categoryFilter)
    : activities;

  const handleActivityClick = (activity: Activity) => {
    setSelectedActivity(activity);
    onActivitySelect?.(activity);
  };

  return (
    <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
      <div className="p-4 border-b border-sandstone/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-eucalyptus/10 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-eucalyptus" />
            </div>
            <div>
              <h3 className="font-semibold text-midnight" style={{ fontFamily: 'var(--font-heading)' }}>
                {destination} Experiences Map
              </h3>
              <p className="text-sm text-midnight/60">
                {filteredActivities.length} places to explore
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              showFilters || categoryFilter
                ? "bg-eucalyptus text-white"
                : "bg-sandstone/50 text-midnight hover:bg-sandstone"
            )}
          >
            <Filter className="w-4 h-4" />
            Filter
            {categoryFilter && (
              <span className="w-5 h-5 bg-white text-eucalyptus rounded-full flex items-center justify-center text-xs">
                1
              </span>
            )}
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 pt-3 border-t border-sandstone/50 animate-fade-in">
            <button
              onClick={() => setCategoryFilter(null)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                !categoryFilter ? "bg-midnight text-white" : "bg-sandstone/50 text-midnight hover:bg-sandstone"
              )}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategoryFilter(category === categoryFilter ? null : category)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center gap-1.5",
                  categoryFilter === category ? "text-white" : "bg-sandstone/50 text-midnight hover:bg-sandstone"
                )}
                style={{ backgroundColor: categoryFilter === category ? CATEGORY_CONFIG[category]?.color : undefined }}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: categoryFilter === category ? 'white' : CATEGORY_CONFIG[category]?.color }}
                />
                {CATEGORY_CONFIG[category]?.label || category}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-[520px] relative">
        <MapContainer center={center} zoom={destination === 'Goa' ? 10 : 12} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {filteredActivities.map((activity) => (
            <Marker
              key={activity.id}
              position={[activity.location.lat, activity.location.lng]}
              icon={createMarkerIcon(activity)}
              eventHandlers={{ click: () => handleActivityClick(activity) }}
            >
              <Popup>
                <div className="max-w-[220px]">
                  <strong>{activity.name}</strong>
                  <p>{activity.category} | {activity.duration_hours}h</p>
                  <p>{activity.cost_inr === 0 ? 'Free' : `Rs ${activity.cost_inr}`}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {selectedActivity && (
        <div className="p-4 bg-sandstone/20 border-t border-sandstone/50 animate-fade-in">
          <div className="flex gap-4">
            <img
              src={selectedActivity.images[0]}
              alt={selectedActivity.name}
              className="w-24 h-24 rounded-xl object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span
                    className="inline-block px-2 py-0.5 rounded text-xs font-medium text-white mb-1"
                    style={{ backgroundColor: CATEGORY_CONFIG[selectedActivity.category]?.color || '#4FA3A5' }}
                  >
                    {CATEGORY_CONFIG[selectedActivity.category]?.label || selectedActivity.category}
                  </span>
                  <h4 className="font-semibold text-midnight">{selectedActivity.name}</h4>
                </div>
                <button
                  onClick={() => setSelectedActivity(null)}
                  className="p-1 hover:bg-sandstone rounded transition-colors"
                >
                  <X className="w-4 h-4 text-midnight/40" />
                </button>
              </div>

              <p className="text-sm text-midnight/60 line-clamp-2 mt-1 mb-3">
                {selectedActivity.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-sm text-midnight/60">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  {selectedActivity.user_rating}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {selectedActivity.duration_hours}h
                </span>
                <span className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  {selectedActivity.cost_inr === 0 ? 'Free' : selectedActivity.cost_inr}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {selectedActivity.location.address.split(',')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
