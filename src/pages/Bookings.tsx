import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plane,
  Hotel as HotelIcon,
  Search,
  Calendar,
  Users,
  Clock,
  Star,
  ChevronRight,
  ChevronDown,
  Check,
  ArrowRight,
  CreditCard,
  Smartphone,
  Building2,
  MapPin,
  IndianRupee,
  Wifi,
  Utensils,
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Download,
  Share2
} from 'lucide-react';
import { Flight, ORIGIN_CITIES, DESTINATION_CITIES } from '@/data/flights';
import { Hotel } from '@/data/hotels';
import {
  searchFlights,
  searchHotels,
  createFlightBooking,
  createHotelBooking,
  createTripBooking,
  saveBooking,
  getBookings,
  formatDate,
  formatTime,
  FlightBooking,
  HotelBooking,
  TripBooking
} from '@/services/bookingService';
import { cn } from '@/utils/cn';
import { toast } from '@/components/notifications/Toast';

// Booking steps
type BookingStep = 'search' | 'flights' | 'hotels' | 'review' | 'payment' | 'confirmation';

export function Bookings() {
  // Current step state
  const [step, setStep] = useState<BookingStep>('search');
  
  // Search form state
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [rooms, setRooms] = useState(1);
  
  // Search results
  const [flightResults, setFlightResults] = useState<Flight[]>([]);
  const [hotelResults, setHotelResults] = useState<Hotel[]>([]);
  
  // Selected items
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [, setSelectedHotel] = useState<Hotel | null>(null);
  
  // Bookings
  const [flightBooking, setFlightBooking] = useState<FlightBooking | null>(null);
  const [hotelBooking, setHotelBooking] = useState<HotelBooking | null>(null);
  
  // Payment & confirmation
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [confirmedBooking, setConfirmedBooking] = useState<TripBooking | null>(null);
  
  // Past bookings
  const [showPastBookings, setShowPastBookings] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const pastBookings = getBookings();

  // Form validation state
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  // Filter states for flights
  const [flightSortBy, setFlightSortBy] = useState<'price' | 'duration' | 'departure'>('price');
  const [stopsFilter, setStopsFilter] = useState<'all' | 'nonstop' | '1stop'>('all');
  
  // Filtered and sorted flights
  const filteredFlights = useMemo(() => {
    let results = [...flightResults];
    
    // Filter by stops
    if (stopsFilter === 'nonstop') {
      results = results.filter(f => f.stops === 0);
    } else if (stopsFilter === '1stop') {
      results = results.filter(f => f.stops === 1);
    }
    
    // Sort
    results.sort((a, b) => {
      switch (flightSortBy) {
        case 'price':
          return a.price - b.price;
        case 'duration':
          return a.duration.localeCompare(b.duration);
        case 'departure':
          return a.departure.localeCompare(b.departure);
        default:
          return 0;
      }
    });
    
    return results;
  }, [flightResults, flightSortBy, stopsFilter]);
  
  // Handle search
  const handleSearch = async () => {
    if (!origin || !destination || !travelDate) return;
    setIsSearching(true);
    setBookingError('');
    
    try {
      const hotelDest = destination === 'Kullu (Manali)' ? 'Manali' : destination;
      const [flights, hotelSearchResults] = await Promise.all([
        searchFlights({
          origin,
          destination,
          date: travelDate,
          passengers
        }),
        searchHotels({
          destination: hotelDest,
          checkIn: travelDate,
          checkOut: returnDate,
          guests: passengers,
          rooms
        })
      ]);

      setFlightResults(flights);
      setHotelResults(hotelSearchResults);
      setStep('flights');
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Search failed');
    } finally {
      setIsSearching(false);
    }
  };
  
  // Handle flight selection
  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    const booking = createFlightBooking(flight, passengers, travelDate);
    setFlightBooking(booking);
    setStep('hotels');
  };
  
  // Handle hotel selection
  const handleHotelSelect = (hotel: Hotel) => {
    setSelectedHotel(hotel);
    if (travelDate && returnDate) {
      const booking = createHotelBooking(hotel, travelDate, returnDate, rooms, passengers);
      setHotelBooking(booking);
    }
    setStep('review');
  };
  
  // Skip hotel
  const handleSkipHotel = () => {
    setSelectedHotel(null);
    setHotelBooking(null);
    setStep('review');
  };
  
  // Handle payment
  const handlePayment = async () => {
    // Validate form
    const errors: Record<string, string> = {};
    if (!contactDetails.name.trim()) {
      errors.name = 'Full name is required';
    } else if (contactDetails.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    if (!contactDetails.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactDetails.email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!contactDetails.phone.trim()) {
      errors.phone = 'Phone number is required';
    } else if (!/^[+]?[\d\s-]{10,}$/.test(contactDetails.phone.replace(/\s/g, ''))) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      toast.error('Validation Error', 'Please check the form fields.');
      return;
    }

    const destName = destination === 'Kullu (Manali)' ? 'Manali' : destination;
    const booking = createTripBooking(
      destName,
      flightBooking,
      hotelBooking,
      contactDetails,
      paymentMethod
    );

    const savedBooking = await saveBooking(booking);
    setConfirmedBooking(savedBooking);
    setStep('confirmation');
  };
  
  // Reset booking flow
  const downloadTicket = () => {
    window.print();
  };

  const shareDetails = () => {
    if (navigator.share && confirmedBooking) {
      navigator.share({
        title: `Trip to ${confirmedBooking.destination}`,
        text: `I just booked a trip to ${confirmedBooking.destination}! Confirmation: ${confirmedBooking.id}`,
        url: window.location.href
      }).catch(console.error);
    } else {
      const text = `My Aura Travel Booking - Trip to ${confirmedBooking?.destination}!\nConfirmation: ${confirmedBooking?.id}\nTotal: ₹${confirmedBooking?.totalCost.toLocaleString()}`;
      navigator.clipboard.writeText(text).then(() => {
        alert('Booking details copied to clipboard!');
      });
    }
  };

  const resetBooking = () => {
    setStep('search');
    setSelectedFlight(null);
    setSelectedHotel(null);
    setFlightBooking(null);
    setHotelBooking(null);
    setConfirmedBooking(null);
    setContactDetails({ name: '', email: '', phone: '' });
  };
  
  // Calculate total
  const totalCost = (flightBooking?.totalPrice || 0) + (hotelBooking?.totalPrice || 0);
  
  // Get tomorrow's date for min date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-pearl">
      {/* Header */}
      <section className="bg-midnight text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Plane className="w-5 h-5 text-eucalyptus" />
                <span className="text-eucalyptus text-sm font-medium">Book Your Journey</span>
              </div>
              <h1 
                className="text-3xl font-bold"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                {step === 'search' && 'Search Flights & Hotels'}
                {step === 'flights' && 'Select Your Flight'}
                {step === 'hotels' && 'Choose Accommodation'}
                {step === 'review' && 'Review Your Booking'}
                {step === 'payment' && 'Complete Payment'}
                {step === 'confirmation' && 'Booking Confirmed!'}
              </h1>
            </div>
            
            {step !== 'search' && step !== 'confirmation' && (
              <button
                onClick={() => setStep(step === 'flights' ? 'search' : step === 'hotels' ? 'flights' : step === 'review' ? 'hotels' : 'review')}
                className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
            )}
          </div>
          
          {/* Progress Steps */}
          {step !== 'confirmation' && (
            <div className="mt-6 flex items-center gap-2">
              {['search', 'flights', 'hotels', 'review', 'payment'].map((s, i) => (
                <div key={s} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step === s ? "bg-eucalyptus text-white" :
                    ['search', 'flights', 'hotels', 'review', 'payment'].indexOf(step) > i 
                      ? "bg-eucalyptus/30 text-eucalyptus" 
                      : "bg-white/10 text-white/40"
                  )}>
                    {['search', 'flights', 'hotels', 'review', 'payment'].indexOf(step) > i ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  {i < 4 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-1",
                      ['search', 'flights', 'hotels', 'review', 'payment'].indexOf(step) > i 
                        ? "bg-eucalyptus/50" 
                        : "bg-white/10"
                    )} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search Step */}
        {step === 'search' && (
          <div className="space-y-8">
            {/* Search Form */}
            <div className="bg-white rounded-2xl border border-sandstone/50 shadow-lg overflow-hidden">
              <div className="p-6 border-b border-sandstone/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-eucalyptus/10 rounded-lg flex items-center justify-center">
                    <Search className="w-5 h-5 text-eucalyptus" />
                  </div>
                  <h2 className="text-xl font-semibold text-midnight" style={{ fontFamily: 'var(--font-heading)' }}>
                    Search for Flights & Hotels
                  </h2>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                {/* Origin & Destination */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      From
                    </label>
                    <select
                      value={origin}
                      onChange={(e) => setOrigin(e.target.value)}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    >
                      <option value="">Select origin city</option>
                      {ORIGIN_CITIES.map(city => (
                        <option key={city.code} value={city.city}>
                          {city.city} ({city.code})
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      To
                    </label>
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    >
                      <option value="">Select destination</option>
                      {DESTINATION_CITIES.map(city => (
                        <option key={city.code} value={city.city}>
                          {city.city} ({city.code})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Dates */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Departure Date
                    </label>
                    <input
                      type="date"
                      value={travelDate}
                      onChange={(e) => setTravelDate(e.target.value)}
                      min={minDate}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      <Calendar className="w-4 h-4 inline mr-1" />
                      Return Date
                    </label>
                    <input
                      type="date"
                      value={returnDate}
                      onChange={(e) => setReturnDate(e.target.value)}
                      min={travelDate || minDate}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    />
                  </div>
                </div>
                
                {/* Passengers & Rooms */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      <Users className="w-4 h-4 inline mr-1" />
                      Passengers
                    </label>
                    <select
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    >
                      {[1, 2, 3, 4, 5, 6].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Passenger' : 'Passengers'}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">
                      <HotelIcon className="w-4 h-4 inline mr-1" />
                      Rooms
                    </label>
                    <select
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                      className="w-full px-4 py-3 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none text-midnight"
                    >
                      {[1, 2, 3, 4].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Room' : 'Rooms'}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                {/* Search Button */}
                <button
                  onClick={handleSearch}
                  disabled={!origin || !destination || !travelDate || isSearching}
                  className={cn(
                    "w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all",
                    origin && destination && travelDate && !isSearching
                      ? "bg-eucalyptus hover:bg-eucalyptus-dark text-white hover:shadow-lg"
                      : "bg-sandstone/50 text-midnight/40 cursor-not-allowed"
                  )}
                >
                  <Search className="w-5 h-5" />
                  {isSearching ? 'Searching...' : 'Search Flights & Hotels'}
                </button>
                {bookingError && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-ember">
                    <AlertCircle className="w-4 h-4" />
                    {bookingError}
                  </div>
                )}
              </div>
            </div>
            
            {/* Past Bookings */}
            {pastBookings.length > 0 && (
              <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden">
                <button
                  onClick={() => setShowPastBookings(!showPastBookings)}
                  className="w-full p-4 flex items-center justify-between hover:bg-sandstone/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-midnight/10 rounded-lg flex items-center justify-center">
                      <Plane className="w-5 h-5 text-midnight" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-midnight">Your Bookings</h3>
                      <p className="text-sm text-midnight/60">{pastBookings.length} booking(s)</p>
                    </div>
                  </div>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-midnight/40 transition-transform",
                    showPastBookings && "rotate-180"
                  )} />
                </button>
                
                {showPastBookings && (
                  <div className="border-t border-sandstone/50 p-4 space-y-4">
                    {pastBookings.map((booking) => (
                      <div key={booking.id} className="p-4 bg-sandstone/20 rounded-xl">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <span className={cn(
                              "px-2 py-0.5 rounded text-xs font-medium",
                              booking.status === 'confirmed' ? "bg-green-100 text-green-700" :
                              booking.status === 'cancelled' ? "bg-red-100 text-red-700" :
                              "bg-yellow-100 text-yellow-700"
                            )}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                            <h4 className="font-semibold text-midnight mt-1">
                              Trip to {booking.destination}
                            </h4>
                          </div>
                          <span className="text-sm text-midnight/60">{booking.id}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-midnight/60">
                          {booking.flightBooking && (
                            <span className="flex items-center gap-1">
                              <Plane className="w-3.5 h-3.5" />
                              {booking.flightBooking.flight.airline}
                            </span>
                          )}
                          {booking.hotelBooking && (
                            <span className="flex items-center gap-1">
                              <HotelIcon className="w-3.5 h-3.5" />
                              {booking.hotelBooking.hotel.name}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <IndianRupee className="w-3.5 h-3.5" />
                            ₹{booking.totalCost.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Empty State for Past Bookings */}
            {pastBookings.length === 0 && (
              <div className="bg-white rounded-2xl border border-sandstone/50 p-8 text-center">
                <div className="w-16 h-16 bg-sandstone/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Plane className="w-8 h-8 text-midnight/30" />
                </div>
                <h3 className="text-lg font-semibold text-midnight mb-2">No Bookings Yet</h3>
                <p className="text-midnight/60 mb-4">Start planning your next adventure!</p>
                <Link
                  to="/weaver"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium rounded-lg transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Plan a Trip
                </Link>
              </div>
            )}

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4">
              <Link
                to="/weaver"
                className="p-6 bg-white rounded-xl border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-lg transition-all group"
              >
                <Sparkles className="w-8 h-8 text-eucalyptus mb-3" />
                <h3 className="font-semibold text-midnight mb-1 group-hover:text-eucalyptus transition-colors">
                  Need an Itinerary?
                </h3>
                <p className="text-sm text-midnight/60">
                  Use AI Experience Weaver to plan your perfect trip first
                </p>
              </Link>
              
              <Link
                to="/explore"
                className="p-6 bg-white rounded-xl border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-lg transition-all group"
              >
                <MapPin className="w-8 h-8 text-eucalyptus mb-3" />
                <h3 className="font-semibold text-midnight mb-1 group-hover:text-eucalyptus transition-colors">
                  Explore Destinations
                </h3>
                <p className="text-sm text-midnight/60">
                  Browse activities in Goa, Manali, and Pune
                </p>
              </Link>
              
              <Link
                to="/live-trip"
                className="p-6 bg-white rounded-xl border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-lg transition-all group"
              >
                <Plane className="w-8 h-8 text-eucalyptus mb-3" />
                <h3 className="font-semibold text-midnight mb-1 group-hover:text-eucalyptus transition-colors">
                  Start Live Trip
                </h3>
                <p className="text-sm text-midnight/60">
                  Track your journey with AI Travel Sync
                </p>
              </Link>
            </div>
          </div>
        )}
        
        {/* Flights Step */}
        {step === 'flights' && (
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Filters Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <div className="bg-white rounded-xl border border-sandstone/50 p-4">
                <h3 className="font-semibold text-midnight mb-4">Filters</h3>
                
                {/* Stops Filter */}
                <div className="mb-4">
                  <label className="text-sm font-medium text-midnight/70 mb-2 block">Stops</label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All' },
                      { value: 'nonstop', label: 'Non-stop' },
                      { value: '1stop', label: '1 Stop' }
                    ].map(option => (
                      <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="stops"
                          checked={stopsFilter === option.value}
                          onChange={() => setStopsFilter(option.value as typeof stopsFilter)}
                          className="w-4 h-4 text-eucalyptus"
                        />
                        <span className="text-sm text-midnight">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Sort */}
                <div>
                  <label className="text-sm font-medium text-midnight/70 mb-2 block">Sort By</label>
                  <select
                    value={flightSortBy}
                    onChange={(e) => setFlightSortBy(e.target.value as typeof flightSortBy)}
                    className="w-full px-3 py-2 bg-sandstone/20 rounded-lg border border-sandstone/50 text-sm"
                  >
                    <option value="price">Price: Low to High</option>
                    <option value="duration">Duration</option>
                    <option value="departure">Departure Time</option>
                  </select>
                </div>
              </div>
              
              {/* Route Summary */}
              <div className="bg-sandstone/30 rounded-xl p-4">
                <p className="text-sm text-midnight/60 mb-2">Showing flights for</p>
                <p className="font-semibold text-midnight">{origin} → {destination}</p>
                <p className="text-sm text-midnight/60">{formatDate(travelDate)}</p>
                <p className="text-sm text-midnight/60">{passengers} passenger(s)</p>
              </div>
            </div>
            
            {/* Flight Results */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-midnight">
                  {filteredFlights.length} flights found
                </h3>
              </div>
              
              {filteredFlights.length === 0 ? (
                <div className="bg-white rounded-xl border border-sandstone/50 p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-midnight/30 mx-auto mb-4" />
                  <h4 className="font-semibold text-midnight mb-2">No flights found</h4>
                  <p className="text-midnight/60">Try adjusting your search criteria</p>
                </div>
              ) : (
                filteredFlights.map((flight) => (
                  <div
                    key={flight.id}
                    className="bg-white rounded-xl border border-sandstone/50 p-4 hover:border-eucalyptus/30 hover:shadow-lg transition-all"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* Airline */}
                      <div className="flex items-center gap-3 md:w-32">
                        <span className="text-2xl">{flight.logo}</span>
                        <div>
                          <p className="font-medium text-midnight text-sm">{flight.airline}</p>
                          <p className="text-xs text-midnight/50">{flight.flightNumber}</p>
                        </div>
                      </div>
                      
                      {/* Times */}
                      <div className="flex-1 flex items-center gap-4">
                        <div className="text-center">
                          <p className="text-xl font-bold text-midnight">{formatTime(flight.departure)}</p>
                          <p className="text-xs text-midnight/50">{flight.origin.code}</p>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center">
                          <p className="text-xs text-midnight/50">{flight.duration}</p>
                          <div className="w-full h-px bg-sandstone my-1 relative">
                            <Plane className="w-4 h-4 text-eucalyptus absolute left-1/2 -translate-x-1/2 -top-2 rotate-90" />
                          </div>
                          <p className="text-xs text-midnight/50">
                            {flight.stops === 0 ? 'Non-stop' : `${flight.stops} stop`}
                          </p>
                        </div>
                        
                        <div className="text-center">
                          <p className="text-xl font-bold text-midnight">{formatTime(flight.arrival)}</p>
                          <p className="text-xs text-midnight/50">{flight.destination.code}</p>
                        </div>
                      </div>
                      
                      {/* Price & Book */}
                      <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-eucalyptus">₹{flight.price.toLocaleString()}</p>
                          <p className="text-xs text-midnight/50">per person</p>
                        </div>
                        <button
                          onClick={() => handleFlightSelect(flight)}
                          className="px-6 py-2 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium rounded-lg transition-colors"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                    
                    {/* Amenities */}
                    <div className="mt-3 pt-3 border-t border-sandstone/30 flex items-center gap-4">
                      {flight.amenities.map((amenity, i) => (
                        <span key={i} className="flex items-center gap-1 text-xs text-midnight/50">
                          {amenity === 'WiFi' && <Wifi className="w-3 h-3" />}
                          {amenity === 'Meal' && <Utensils className="w-3 h-3" />}
                          {amenity}
                        </span>
                      ))}
                      <span className="text-xs text-midnight/50">
                        {flight.seatsAvailable} seats left
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
        
        {/* Hotels Step */}
        {step === 'hotels' && (
          <div className="space-y-6">
            {/* Selected Flight Summary */}
            {selectedFlight && (
              <div className="bg-eucalyptus/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Check className="w-6 h-6 text-eucalyptus" />
                  <div>
                    <p className="font-medium text-midnight">Flight Selected</p>
                    <p className="text-sm text-midnight/60">
                      {selectedFlight.airline} {selectedFlight.flightNumber} • {selectedFlight.origin.code} → {selectedFlight.destination.code}
                    </p>
                  </div>
                </div>
                <p className="font-bold text-eucalyptus">₹{(selectedFlight.price * passengers).toLocaleString()}</p>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-midnight">
                {hotelResults.length} hotels in {destination === 'Kullu (Manali)' ? 'Manali' : destination}
              </h3>
              <button
                onClick={handleSkipHotel}
                className="text-sm text-midnight/60 hover:text-eucalyptus transition-colors"
              >
                Skip, I'll book hotel later →
              </button>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {hotelResults.map((hotel) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-xl border border-sandstone/50 overflow-hidden hover:border-eucalyptus/30 hover:shadow-lg transition-all"
                >
                  <div className="h-48 overflow-hidden">
                    <img 
                      src={hotel.images[0]} 
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-1 mb-1">
                          {Array.from({ length: hotel.star_rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <h4 className="font-semibold text-midnight">{hotel.name}</h4>
                      </div>
                      <div className="flex items-center gap-1 bg-eucalyptus/10 px-2 py-1 rounded">
                        <Star className="w-3 h-3 text-eucalyptus fill-eucalyptus" />
                        <span className="text-sm font-medium text-eucalyptus">{hotel.user_rating}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-midnight/60 mb-3 line-clamp-2">{hotel.description}</p>
                    
                    {/* Amenities */}
                    <div className="flex flex-wrap gap-1 mb-4">
                      {hotel.amenities.slice(0, 4).map((amenity, i) => (
                        <span key={i} className="px-2 py-0.5 bg-sandstone/50 rounded text-xs text-midnight/60">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-2xl font-bold text-midnight">₹{hotel.price_per_night.toLocaleString()}</p>
                        <p className="text-xs text-midnight/50">per night</p>
                      </div>
                      <button
                        onClick={() => handleHotelSelect(hotel)}
                        className="px-6 py-2 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-medium rounded-lg transition-colors"
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Review Step */}
        {step === 'review' && (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Booking Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Flight Details */}
              {flightBooking && (
                <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden">
                  <div className="p-4 border-b border-sandstone/50 flex items-center gap-3">
                    <Plane className="w-5 h-5 text-eucalyptus" />
                    <h3 className="font-semibold text-midnight">Flight Details</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-3xl">{flightBooking.flight.logo}</span>
                      <div>
                        <p className="font-medium text-midnight">{flightBooking.flight.airline}</p>
                        <p className="text-sm text-midnight/60">{flightBooking.flight.flightNumber}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 mb-4">
                      <div>
                        <p className="text-xl font-bold text-midnight">{formatTime(flightBooking.flight.departure)}</p>
                        <p className="text-sm text-midnight/60">{flightBooking.flight.origin.city}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-midnight/30" />
                      <div>
                        <p className="text-xl font-bold text-midnight">{formatTime(flightBooking.flight.arrival)}</p>
                        <p className="text-sm text-midnight/60">{flightBooking.flight.destination.city}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-midnight/60">
                      <span><Calendar className="w-4 h-4 inline mr-1" />{formatDate(flightBooking.travelDate)}</span>
                      <span><Users className="w-4 h-4 inline mr-1" />{flightBooking.passengers} passenger(s)</span>
                      <span><Clock className="w-4 h-4 inline mr-1" />{flightBooking.flight.duration}</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Hotel Details */}
              {hotelBooking && (
                <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden">
                  <div className="p-4 border-b border-sandstone/50 flex items-center gap-3">
                    <HotelIcon className="w-5 h-5 text-eucalyptus" />
                    <h3 className="font-semibold text-midnight">Hotel Details</h3>
                  </div>
                  <div className="p-4">
                    <div className="flex gap-4">
                      <img 
                        src={hotelBooking.hotel.images[0]} 
                        alt={hotelBooking.hotel.name}
                        className="w-24 h-24 rounded-lg object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-midnight">{hotelBooking.hotel.name}</h4>
                        <div className="flex items-center gap-1 my-1">
                          {Array.from({ length: hotelBooking.hotel.star_rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-500 fill-amber-500" />
                          ))}
                        </div>
                        <p className="text-sm text-midnight/60">{hotelBooking.hotel.location.address}</p>
                      </div>
                    </div>
                    
                    <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-midnight/60">Check-in</p>
                        <p className="font-medium text-midnight">{formatDate(hotelBooking.checkIn)}</p>
                      </div>
                      <div>
                        <p className="text-midnight/60">Check-out</p>
                        <p className="font-medium text-midnight">{formatDate(hotelBooking.checkOut)}</p>
                      </div>
                      <div>
                        <p className="text-midnight/60">Duration</p>
                        <p className="font-medium text-midnight">{hotelBooking.nights} night(s)</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Contact Details Form */}
              <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden">
                <div className="p-4 border-b border-sandstone/50">
                  <h3 className="font-semibold text-midnight">Contact Details</h3>
                </div>
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-midnight/70 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={contactDetails.name}
                      onChange={(e) => {
                        setContactDetails({ ...contactDetails, name: e.target.value });
                        if (validationErrors.name) {
                          setValidationErrors({ ...validationErrors, name: '' });
                        }
                      }}
                      placeholder="Enter your full name"
                      className={cn(
                        "w-full px-4 py-3 bg-sandstone/20 rounded-xl border outline-none transition-colors",
                        validationErrors.name
                          ? "border-ember focus:border-ember focus:ring-2 focus:ring-ember/20"
                          : "border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                      )}
                    />
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-ember">{validationErrors.name}</p>
                    )}
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-midnight/70 mb-2">Email</label>
                      <input
                        type="email"
                        value={contactDetails.email}
                        onChange={(e) => {
                          setContactDetails({ ...contactDetails, email: e.target.value });
                          if (validationErrors.email) {
                            setValidationErrors({ ...validationErrors, email: '' });
                          }
                        }}
                        placeholder="your@email.com"
                        className={cn(
                          "w-full px-4 py-3 bg-sandstone/20 rounded-xl border outline-none transition-colors",
                          validationErrors.email
                            ? "border-ember focus:border-ember focus:ring-2 focus:ring-ember/20"
                            : "border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                        )}
                      />
                      {validationErrors.email && (
                        <p className="mt-1 text-sm text-ember">{validationErrors.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-midnight/70 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={contactDetails.phone}
                        onChange={(e) => {
                          setContactDetails({ ...contactDetails, phone: e.target.value });
                          if (validationErrors.phone) {
                            setValidationErrors({ ...validationErrors, phone: '' });
                          }
                        }}
                        placeholder="+91 98765 43210"
                        className={cn(
                          "w-full px-4 py-3 bg-sandstone/20 rounded-xl border outline-none transition-colors",
                          validationErrors.phone
                            ? "border-ember focus:border-ember focus:ring-2 focus:ring-ember/20"
                            : "border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20"
                        )}
                      />
                      {validationErrors.phone && (
                        <p className="mt-1 text-sm text-ember">{validationErrors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Price Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-sandstone/50">
                  <h3 className="font-semibold text-midnight">Price Summary</h3>
                </div>
                <div className="p-4 space-y-4">
                  {flightBooking && (
                    <div className="flex justify-between">
                      <span className="text-midnight/60">Flight ({flightBooking.passengers} pax)</span>
                      <span className="font-medium text-midnight">₹{flightBooking.totalPrice.toLocaleString()}</span>
                    </div>
                  )}
                  
                  {hotelBooking && (
                    <div className="flex justify-between">
                      <span className="text-midnight/60">Hotel ({hotelBooking.nights} nights)</span>
                      <span className="font-medium text-midnight">₹{hotelBooking.totalPrice.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="border-t border-sandstone/50 pt-4 flex justify-between">
                    <span className="font-semibold text-midnight">Total</span>
                    <span className="text-2xl font-bold text-eucalyptus">₹{totalCost.toLocaleString()}</span>
                  </div>
                  
                  <button
                    onClick={() => setStep('payment')}
                    className="w-full py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    Proceed to Payment
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Payment Step */}
        {step === 'payment' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden">
                <div className="p-4 border-b border-sandstone/50">
                  <h3 className="font-semibold text-midnight">Select Payment Method</h3>
                </div>
                <div className="p-4 space-y-4">
                  {[
                    { id: 'card', label: 'Credit/Debit Card', icon: CreditCard, desc: 'Visa, Mastercard, RuPay' },
                    { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, Paytm' },
                    { id: 'netbanking', label: 'Net Banking', icon: Building2, desc: 'All major banks' }
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id)}
                      className={cn(
                        "w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all text-left",
                        paymentMethod === method.id
                          ? "border-eucalyptus bg-eucalyptus/5"
                          : "border-sandstone/50 hover:border-sandstone"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        paymentMethod === method.id ? "bg-eucalyptus text-white" : "bg-sandstone/30 text-midnight"
                      )}>
                        <method.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-midnight">{method.label}</p>
                        <p className="text-sm text-midnight/60">{method.desc}</p>
                      </div>
                      {paymentMethod === method.id && (
                        <Check className="w-6 h-6 text-eucalyptus" />
                      )}
                    </button>
                  ))}
                  
                  {/* Mock payment form */}
                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-sandstone/20 rounded-xl space-y-4">
                      <p className="text-sm text-midnight/60 text-center">
                        🔒 This is a demo. No actual payment will be processed.
                      </p>
                      <input
                        type="text"
                        placeholder="Card Number"
                        className="w-full px-4 py-3 bg-white rounded-lg border border-sandstone/50"
                        defaultValue="4111 1111 1111 1111"
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="px-4 py-3 bg-white rounded-lg border border-sandstone/50"
                          defaultValue="12/25"
                        />
                        <input
                          type="text"
                          placeholder="CVV"
                          className="px-4 py-3 bg-white rounded-lg border border-sandstone/50"
                          defaultValue="123"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Final Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-sandstone/50 overflow-hidden sticky top-24">
                <div className="p-4 border-b border-sandstone/50">
                  <h3 className="font-semibold text-midnight">Order Summary</h3>
                </div>
                <div className="p-4 space-y-4">
                  <p className="text-midnight font-medium">{contactDetails.name || 'Guest'}</p>
                  <p className="text-sm text-midnight/60">{contactDetails.email || 'No email provided'}</p>
                  
                  <div className="border-t border-sandstone/50 pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-midnight/60">Subtotal</span>
                      <span className="text-midnight">₹{totalCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-midnight/60">Taxes & Fees</span>
                      <span className="text-midnight">Included</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-sandstone/50">
                      <span className="font-semibold text-midnight">Total</span>
                      <span className="text-2xl font-bold text-eucalyptus">₹{totalCost.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={handlePayment}
                    disabled={!contactDetails.name || !contactDetails.email || !contactDetails.phone}
                    className={cn(
                      "w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2",
                      contactDetails.name && contactDetails.email && contactDetails.phone
                        ? "bg-eucalyptus hover:bg-eucalyptus-dark text-white"
                        : "bg-sandstone/50 text-midnight/40 cursor-not-allowed"
                    )}
                  >
                    <CreditCard className="w-5 h-5" />
                    Pay ₹{totalCost.toLocaleString()}
                  </button>
                  
                  <p className="text-xs text-midnight/50 text-center">
                    By proceeding, you agree to our Terms & Conditions
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Confirmation Step */}
        {step === 'confirmation' && confirmedBooking && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-sandstone/50 overflow-hidden shadow-lg">
              {/* Success Header */}
              <div className="bg-eucalyptus/10 p-8 text-center">
                <div className="w-20 h-20 bg-eucalyptus rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-10 h-10 text-white" />
                </div>
                <h2 
                  className="text-2xl font-bold text-midnight mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Booking Confirmed!
                </h2>
                <p className="text-midnight/60">
                  Your trip to {confirmedBooking.destination} is booked
                </p>
                <p className="text-sm text-midnight/50 mt-2">
                  Confirmation ID: <span className="font-mono font-bold">{confirmedBooking.id}</span>
                </p>
              </div>
              
              {/* Booking Details */}
              <div className="p-6 space-y-4">
                {confirmedBooking.flightBooking && (
                  <div className="p-4 bg-sandstone/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <Plane className="w-4 h-4 text-eucalyptus" />
                      <span className="font-medium text-midnight">Flight</span>
                    </div>
                    <p className="text-midnight">
                      {confirmedBooking.flightBooking.flight.airline} {confirmedBooking.flightBooking.flight.flightNumber}
                    </p>
                    <p className="text-sm text-midnight/60">
                      {confirmedBooking.flightBooking.flight.origin.city} → {confirmedBooking.flightBooking.flight.destination.city}
                    </p>
                    <p className="text-sm text-midnight/60">
                      {formatDate(confirmedBooking.flightBooking.travelDate)} at {formatTime(confirmedBooking.flightBooking.flight.departure)}
                    </p>
                  </div>
                )}
                
                {confirmedBooking.hotelBooking && (
                  <div className="p-4 bg-sandstone/20 rounded-xl">
                    <div className="flex items-center gap-2 mb-2">
                      <HotelIcon className="w-4 h-4 text-eucalyptus" />
                      <span className="font-medium text-midnight">Hotel</span>
                    </div>
                    <p className="text-midnight">{confirmedBooking.hotelBooking.hotel.name}</p>
                    <p className="text-sm text-midnight/60">
                      {formatDate(confirmedBooking.hotelBooking.checkIn)} - {formatDate(confirmedBooking.hotelBooking.checkOut)}
                    </p>
                    <p className="text-sm text-midnight/60">
                      {confirmedBooking.hotelBooking.nights} night(s), {confirmedBooking.hotelBooking.rooms} room(s)
                    </p>
                  </div>
                )}
                
                <div className="border-t border-sandstone/50 pt-4 flex justify-between items-center">
                  <span className="text-midnight/60">Total Paid</span>
                  <span className="text-2xl font-bold text-eucalyptus">₹{confirmedBooking.totalCost.toLocaleString()}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="p-6 bg-sandstone/10 border-t border-sandstone/50 flex flex-col sm:flex-row gap-3">
                <button onClick={downloadTicket} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-sandstone/50 rounded-xl text-midnight font-medium hover:bg-sandstone/20 transition-colors">
                  <Download className="w-4 h-4" />
                  Download Ticket
                </button>
                <button onClick={shareDetails} className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border border-sandstone/50 rounded-xl text-midnight font-medium hover:bg-sandstone/20 transition-colors">
                  <Share2 className="w-4 h-4" />
                  Share Details
                </button>
              </div>
              
              <div className="p-6 border-t border-sandstone/50">
                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    to="/live-trip"
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-eucalyptus hover:bg-eucalyptus-dark text-white rounded-xl font-medium transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                    Start Live Trip
                  </Link>
                  <button
                    onClick={resetBooking}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-midnight text-white rounded-xl font-medium hover:bg-midnight/80 transition-colors"
                  >
                    Book Another Trip
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
