import { useEffect, useMemo, useState } from 'react';
import * as L from 'leaflet';
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet';
import { MapPin, Navigation, Clock, IndianRupee, Loader2 } from 'lucide-react';
import { Activity } from '@/data';

interface ItineraryMapProps {
  activities: {
    timeSlot: string;
    activity: Activity;
    scheduledTime: string;
  }[];
  destination: string;
  day?: number;
}

interface RouteSegment {
  distance: number; // in km
  duration: number; // in minutes
}

const DESTINATION_CENTERS: Record<string, [number, number]> = {
  Goa: [15.4909, 73.8278],
  Manali: [32.2396, 77.1887],
  Pune: [18.5204, 73.8567]
};

const CATEGORY_COLORS: Record<string, string> = {
  leisure: '#4FA3A5',
  cultural: '#8B5CF6',
  adventure: '#E07A5F',
  wellness: '#10B981',
  wildlife: '#F59E0B',
  shopping: '#EC4899',
  nightlife: '#6366F1',
  food: '#F97316',
  spiritual: '#6366F1'
};

function createNumberIcon(index: number, category: string) {
  const color = CATEGORY_COLORS[category] || '#4FA3A5';
  return L.divIcon({
    className: 'aura-route-marker',
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -32],
    html: `<div style="width:34px;height:34px;border-radius:999px;background:${color};border:3px solid white;box-shadow:0 10px 25px rgba(15,23,42,.25);display:flex;align-items:center;justify-content:center;color:white;font-weight:800;">${index + 1}</div>`
  });
}

// Fallback haversine distance for when OSRM fails
function calculateHaversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const radius = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  return radius * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

// Fetch road distance via OSRM free API
async function fetchRouteDistance(
  lat1: number, lng1: number,
  lat2: number, lng2: number
): Promise<RouteSegment> {
  const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=false`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
    const route = data.routes[0];
    return {
      distance: route.distance / 1000, // convert meters to km
      duration: route.duration / 60   // convert seconds to minutes
    };
  }

  // Fallback to haversine if OSRM fails
  const straightLineDist = calculateHaversineDistance(lat1, lng1, lat2, lng2);
  return {
    distance: straightLineDist,
    duration: straightLineDist * 3 // rough estimate: ~3 min per km
  };
}

export function ItineraryMap({ activities, destination, day }: ItineraryMapProps) {
  const routePoints = useMemo<[number, number][]>(() => (
    activities.map((item) => [item.activity.location.lat, item.activity.location.lng])
  ), [activities]);

  const center = routePoints[0] || DESTINATION_CENTERS[destination] || DESTINATION_CENTERS.Goa;

  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);

  useEffect(() => {
    if (routePoints.length < 2) return;

    let cancelled = false;
    setIsLoadingRoutes(true);

    async function fetchAllRoutes() {
      const segments: RouteSegment[] = [];
      for (let i = 1; i < routePoints.length; i++) {
        const [lat1, lng1] = routePoints[i - 1];
        const [lat2, lng2] = routePoints[i];
        const segment = await fetchRouteDistance(lat1, lng1, lat2, lng2);
        if (!cancelled) {
          segments.push(segment);
          setRouteSegments([...segments]);
        }
      }
      if (!cancelled) setIsLoadingRoutes(false);
    }

    fetchAllRoutes();
    return () => { cancelled = true; };
  }, [routePoints]);

  const totalDistance = routeSegments.reduce((sum, s) => sum + s.distance, 0);
  const totalDuration = routeSegments.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
      <div className="p-4 border-b border-sandstone/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-eucalyptus/10 rounded-lg flex items-center justify-center">
            <Navigation className="w-4 h-4 text-eucalyptus" />
          </div>
          <div>
            <h3 className="font-semibold text-midnight" style={{ fontFamily: 'var(--font-heading)' }}>
              {day ? `Day ${day} Route` : 'Trip Route'}
            </h3>
            <p className="text-sm text-midnight/60 flex items-center gap-1">
              {activities.length} stops
              {isLoadingRoutes ? (
                <>
                  | <Loader2 className="w-3 h-3 animate-spin" /> Calculating routes...
                </>
              ) : totalDistance > 0 ? (
                <> | {totalDistance.toFixed(1)} km | ~{Math.round(totalDuration)} min</>
              ) : null}
            </p>
          </div>
        </div>
      </div>

      <div className="h-[420px]">
        <MapContainer center={center} zoom={destination === 'Goa' ? 10 : 12} className="h-full w-full" scrollWheelZoom>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          {routePoints.length > 1 && (
            <Polyline positions={routePoints} color="#4FA3A5" weight={4} opacity={0.85} dashArray="8 8" />
          )}
          {activities.map((item, index) => (
            <Marker
              key={`${item.activity.id}-${index}`}
              position={[item.activity.location.lat, item.activity.location.lng]}
              icon={createNumberIcon(index, item.activity.category)}
            >
              <Popup>
                <div className="max-w-[240px]">
                  <strong>{item.activity.name}</strong>
                  <p>{item.scheduledTime} | {item.timeSlot}</p>
                  <p>{item.activity.description.slice(0, 120)}...</p>
                  <p>
                    <Clock size={12} /> {item.activity.duration_hours}h |{' '}
                    <IndianRupee size={12} /> {item.activity.cost_inr === 0 ? 'Free' : item.activity.cost_inr}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-4 bg-sandstone/20 border-t border-sandstone/50">
        <div className="grid gap-3 md:grid-cols-3">
          {activities.map((item, index) => (
            <div key={`${item.activity.id}-summary`} className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-full bg-eucalyptus text-white flex items-center justify-center text-xs font-bold">
                {index + 1}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-midnight truncate">{item.activity.name}</p>
                <p className="text-xs text-midnight/50 flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {item.activity.location.address.split(',')[0]}
                  {routeSegments[index - 1] && (
                    <span className="text-eucalyptus ml-1">
                      • {routeSegments[index - 1].distance.toFixed(1)} km, ~{Math.round(routeSegments[index - 1].duration)} min
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
