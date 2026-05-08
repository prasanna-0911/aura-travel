import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  Clock, 
  IndianRupee, 
  Filter, 
  Search, 
  Grid, 
  Map as MapIcon,
  ChevronDown,
  Sparkles,
  Mountain,
  Palmtree,
  Building2
} from 'lucide-react';
import { Activity, activities as localActivities } from '@/data';
import { getActivities } from '@/services/catalogService';
import { DestinationMap } from '@/components/maps';
import { cn } from '@/utils/cn';

// Destination data
const DESTINATIONS = [
  {
    id: 'Goa',
    name: 'Goa',
    tagline: 'Sun, Sand & Serenity',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
    icon: Palmtree,
    color: '#4FA3A5'
  },
  {
    id: 'Manali',
    name: 'Manali',
    tagline: 'Mountains & Mystique',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
    icon: Mountain,
    color: '#8B5CF6'
  },
  {
    id: 'Pune',
    name: 'Pune',
    tagline: 'Heritage & Modernity',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop',
    icon: Building2,
    color: '#E07A5F'
  }
];

// Category config
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'leisure', label: 'Leisure' },
  { id: 'cultural', label: 'Cultural' },
  { id: 'adventure', label: 'Adventure' },
  { id: 'wellness', label: 'Wellness' },
  { id: 'food', label: 'Food' },
  { id: 'spiritual', label: 'Spiritual' },
  { id: 'wildlife', label: 'Wildlife' },
  { id: 'shopping', label: 'Shopping' },
  { id: 'nightlife', label: 'Nightlife' }
];

export function Explore() {
  const [selectedDestination, setSelectedDestination] = useState<string>('Goa');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'duration'>('rating');
  const [activities, setActivities] = useState<Activity[]>(localActivities);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);

    getActivities({ destination: selectedDestination })
      .then((nextActivities) => {
        if (mounted) setActivities(nextActivities);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [selectedDestination]);
  
  // Filter and sort activities
  const filteredActivities = useMemo(() => {
    let result = activities.filter(a => a.destination === selectedDestination);
    
    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter(a => a.category === selectedCategory);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(a => 
        a.name.toLowerCase().includes(query) ||
        a.description.toLowerCase().includes(query) ||
        a.experiential_tags.some(tag => tag.includes(query))
      );
    }
    
    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.user_rating - a.user_rating;
        case 'price':
          return a.cost_inr - b.cost_inr;
        case 'duration':
          return a.duration_hours - b.duration_hours;
        default:
          return 0;
      }
    });
    
    return result;
  }, [selectedDestination, selectedCategory, searchQuery, sortBy]);
  
  const currentDestination = DESTINATIONS.find(d => d.id === selectedDestination);
  
  return (
    <div className="min-h-screen bg-pearl">
      {/* Hero Section */}
      <section className="relative h-64 md:h-80 overflow-hidden">
        <img 
          src={currentDestination?.image}
          alt={currentDestination?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/80 via-midnight/40 to-transparent" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 w-full">
            <div className="flex items-center gap-2 mb-2">
              {currentDestination?.icon && (
                <currentDestination.icon className="w-6 h-6 text-white" />
              )}
              <span className="text-white/80 text-sm">
                {filteredActivities.length} experiences
              </span>
            </div>
            <h1 
              className="text-4xl md:text-5xl font-bold text-white mb-2"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Explore {currentDestination?.name}
            </h1>
            <p className="text-white/80 text-lg">{currentDestination?.tagline}</p>
          </div>
        </div>
      </section>
      
      {/* Destination Tabs */}
      <section className="bg-white border-b border-sandstone/50 sticky top-16 md:top-20 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-4 overflow-x-auto">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.id}
                onClick={() => setSelectedDestination(dest.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full font-medium whitespace-nowrap transition-all",
                  selectedDestination === dest.id
                    ? "text-white"
                    : "bg-sandstone/50 text-midnight hover:bg-sandstone"
                )}
                style={{
                  backgroundColor: selectedDestination === dest.id ? dest.color : undefined
                }}
              >
                <dest.icon className="w-4 h-4" />
                {dest.name}
              </button>
            ))}
            
            <div className="flex-1" />
            
            {/* AI Weaver CTA */}
            <Link
              to="/weaver"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-eucalyptus hover:bg-eucalyptus-dark text-white rounded-full font-medium transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Use AI to Plan
            </Link>
          </div>
        </div>
      </section>
      
      {/* Filters Bar */}
      <section className="bg-white border-b border-sandstone/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight/40" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-sandstone/30 rounded-lg border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight placeholder:text-midnight/40"
              />
            </div>
            
            {/* Category Filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedCategory === cat.id
                      ? "bg-midnight text-white"
                      : "bg-sandstone/50 text-midnight hover:bg-sandstone"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
            
            {/* Sort & View Controls */}
            <div className="flex items-center gap-2">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  className="appearance-none px-4 py-2 pr-8 bg-sandstone/30 rounded-lg border border-sandstone/50 text-sm text-midnight cursor-pointer focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none"
                >
                  <option value="rating">Top Rated</option>
                  <option value="price">Price: Low to High</option>
                  <option value="duration">Duration</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-midnight/40 pointer-events-none" />
              </div>
              
              {/* View Toggle */}
              <div className="flex items-center bg-sandstone/30 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'grid'
                      ? "bg-white text-midnight shadow-sm"
                      : "text-midnight/40 hover:text-midnight"
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('map')}
                  className={cn(
                    "p-2 rounded-md transition-colors",
                    viewMode === 'map'
                      ? "bg-white text-midnight shadow-sm"
                      : "text-midnight/40 hover:text-midnight"
                  )}
                >
                  <MapIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading && (
          <div className="mb-4 text-sm text-midnight/50">Loading latest curated experiences...</div>
        )}
        {viewMode === 'map' ? (
          /* Map View */
          <DestinationMap 
            activities={filteredActivities}
            destination={selectedDestination}
          />
        ) : (
          /* Grid View */
          <>
            {filteredActivities.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-sandstone/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-8 h-8 text-midnight/30" />
                </div>
                <h3 className="text-lg font-semibold text-midnight mb-2">No activities found</h3>
                <p className="text-midnight/60">Try adjusting your filters or search query</p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredActivities.map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Activity Card Component
function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden hover:shadow-lg hover:border-eucalyptus/30 transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img 
          src={activity.images[0]} 
          alt={activity.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-midnight/40 to-transparent" />
        
        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-midnight capitalize">
          {activity.category}
        </span>
        
        {/* Rating */}
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-medium text-midnight">{activity.user_rating}</span>
        </div>
        
        {/* Best Time Badge */}
        <span className="absolute bottom-3 right-3 px-2.5 py-1 bg-midnight/70 backdrop-blur-sm rounded-full text-xs text-white capitalize">
          Best: {activity.best_time}
        </span>
      </div>
      
      {/* Content */}
      <div className="p-5">
        <h3 
          className="font-semibold text-midnight mb-2 line-clamp-1"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          {activity.name}
        </h3>
        
        <p className="text-sm text-midnight/60 line-clamp-2 mb-3">
          {activity.description}
        </p>
        
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-midnight/60 mb-3">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            {activity.duration_hours}h
          </span>
          <span className="flex items-center gap-1">
            <IndianRupee className="w-3.5 h-3.5" />
            {activity.cost_inr === 0 ? 'Free' : `₹${activity.cost_inr}`}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {activity.location.address.split(',')[0]}
          </span>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5">
          {activity.experiential_tags.slice(0, 3).map((tag, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-sandstone/50 rounded text-xs text-midnight/60"
            >
              {tag}
            </span>
          ))}
          {activity.experiential_tags.length > 3 && (
            <span className="px-2 py-0.5 text-xs text-midnight/40">
              +{activity.experiential_tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
