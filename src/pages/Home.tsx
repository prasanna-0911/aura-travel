import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  RefreshCw, 
  Map, 
  MessageSquare, 
  ArrowRight, 
  Plane,
  Mountain,
  Palmtree,
  Building2,
  Star,
  Clock,
  Shield
} from 'lucide-react';

// Featured destinations data
const destinations = [
  {
    id: 'goa',
    name: 'Goa',
    tagline: 'Sun, Sand & Serenity',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
    activities: 60,
    tags: ['Beach', 'Nightlife', 'Culture'],
    icon: Palmtree,
  },
  {
    id: 'manali',
    name: 'Manali',
    tagline: 'Mountains & Mystique',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
    activities: 30,
    tags: ['Adventure', 'Nature', 'Peaceful'],
    icon: Mountain,
  },
  {
    id: 'pune',
    name: 'Pune',
    tagline: 'Heritage & Modernity',
    image: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop',
    activities: 20,
    tags: ['Culture', 'Food', 'History'],
    icon: Building2,
  },
];

// Features data
const features = [
  {
    icon: Sparkles,
    title: 'AI Experience Weaver',
    description: 'Tell us your dream trip in natural language. Our AI understands your mood, preferences, and creates perfect itineraries.',
    color: 'eucalyptus',
  },
  {
    icon: RefreshCw,
    title: 'AI Travel Sync',
    description: 'Real-time trip adaptation. Weather changes? Plans disrupted? We proactively suggest alternatives that match your vibe.',
    color: 'ember',
  },
  {
    icon: Map,
    title: 'Interactive Maps',
    description: 'Visualize your entire journey with interactive maps, routes, and travel times between destinations.',
    color: 'eucalyptus',
  },
  {
    icon: MessageSquare,
    title: 'Natural Language',
    description: 'No forms, no filters. Just describe what you want: "peaceful mountains for 3 days" and watch the magic.',
    color: 'eucalyptus',
  },
];

// Stats
const stats = [
  { value: '110+', label: 'Curated Experiences' },
  { value: '3', label: 'Destinations' },
  { value: '95', label: 'Experiential Tags' },
  { value: '< 5s', label: 'Itinerary Generation' },
];

export function Home() {
  return (
    <div className="bg-pearl">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-10 w-72 h-72 bg-eucalyptus/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-sandstone/30 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24 md:pt-24 md:pb-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-eucalyptus/10 rounded-full mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 text-eucalyptus" />
              <span className="text-sm font-medium text-eucalyptus">AI-Powered Travel Planning</span>
            </div>

            {/* Headline */}
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-midnight leading-tight mb-6 animate-fade-in-up"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Your story.{' '}
              <span className="text-eucalyptus">Your pace.</span>{' '}
              Your journey.
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-xl text-midnight/60 leading-relaxed mb-8 animate-fade-in-up delay-100">
              Experience travel that truly understands you. Our AI crafts personalized itineraries 
              based on your mood, adapts in real-time, and ensures every moment feels right.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
              <Link
                to="/weaver"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-eucalyptus/20 hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Start Your Journey
              </Link>
              <Link
                to="/explore"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-sandstone/50 text-midnight font-semibold rounded-xl border border-sandstone transition-all duration-200 hover:-translate-y-0.5"
              >
                Explore Destinations
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Hero Image/Illustration */}
          <div className="mt-16 md:mt-20 relative animate-fade-in-up delay-300">
            <div className="bg-white rounded-2xl shadow-2xl shadow-midnight/10 overflow-hidden border border-sandstone/50">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-4 py-3 bg-sandstone/30 border-b border-sandstone/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-ember/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
                  <div className="w-3 h-3 rounded-full bg-green-400/60" />
                </div>
                <div className="flex-1 flex justify-center">
                  <div className="px-4 py-1 bg-white/60 rounded-lg text-xs text-midnight/40">
                    auratravel.com/weaver
                  </div>
                </div>
              </div>
              {/* Content Preview */}
              <div className="p-6 md:p-8 bg-gradient-to-br from-pearl to-white">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Query Input */}
                  <div className="flex-1">
                    <div className="bg-sandstone/30 rounded-xl p-4 mb-4">
                      <p className="text-sm text-midnight/40 mb-2">What experience are you looking for?</p>
                      <p className="text-midnight font-medium">
                        "I want a peaceful beach trip with cultural experiences for 3 days"
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-eucalyptus/10 text-eucalyptus text-sm rounded-full">peaceful</span>
                      <span className="px-3 py-1 bg-eucalyptus/10 text-eucalyptus text-sm rounded-full">beach</span>
                      <span className="px-3 py-1 bg-eucalyptus/10 text-eucalyptus text-sm rounded-full">cultural</span>
                      <span className="px-3 py-1 bg-eucalyptus/10 text-eucalyptus text-sm rounded-full">3 days</span>
                    </div>
                  </div>
                  {/* Result Preview */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-eucalyptus/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                        <Plane className="w-8 h-8 text-eucalyptus" />
                      </div>
                      <p className="text-midnight font-semibold mb-1">Goa Itinerary Generated</p>
                      <p className="text-sm text-midnight/50">3 days • 9 activities • 1 hotel</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-midnight">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-eucalyptus mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold text-midnight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Travel planning, reimagined
            </h2>
            <p className="text-midnight/60 text-lg">
              Powered by AI that understands not just where you want to go, but how you want to feel.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-xl hover:shadow-eucalyptus/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  feature.color === 'ember' ? 'bg-ember/10' : 'bg-eucalyptus/10'
                }`}>
                  <feature.icon className={`w-6 h-6 ${
                    feature.color === 'ember' ? 'text-ember' : 'text-eucalyptus'
                  }`} />
                </div>
                <h3 
                  className="text-lg font-semibold text-midnight mb-2"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-midnight/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Section */}
      <section className="py-20 md:py-28 bg-sandstone/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <h2 
                className="text-3xl md:text-4xl font-bold text-midnight mb-2"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Popular destinations
              </h2>
              <p className="text-midnight/60 text-lg">
                Curated experiences across India's most loved locations.
              </p>
            </div>
            <Link 
              to="/explore" 
              className="inline-flex items-center gap-2 text-eucalyptus hover:text-eucalyptus-dark font-medium transition-colors"
            >
              View all destinations
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {destinations.map((destination) => (
              <Link
                key={destination.id}
                to={`/explore?destination=${destination.id}`}
                className="group bg-white rounded-2xl overflow-hidden border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-xl hover:shadow-eucalyptus/5 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-midnight/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-2 mb-1">
                      <destination.icon className="w-4 h-4 text-white" />
                      <span className="text-white/80 text-sm">{destination.activities} experiences</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-heading)' }}>
                      {destination.name}
                    </h3>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <p className="text-midnight/60 text-sm mb-3">{destination.tagline}</p>
                  <div className="flex flex-wrap gap-2">
                    {destination.tags.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-sandstone/50 text-midnight/70 text-xs rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 
              className="text-3xl md:text-4xl font-bold text-midnight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How it works
            </h2>
            <p className="text-midnight/60 text-lg">
              Three simple steps to your perfect journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Tell us your vibe',
                description: 'Describe your ideal trip in your own words. "Adventurous mountains" or "romantic beach getaway" – we understand.',
                icon: MessageSquare,
              },
              {
                step: '02',
                title: 'Get your itinerary',
                description: 'Our AI crafts a personalized day-by-day plan with activities, hotels, and restaurants that match your mood.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Travel with sync',
                description: 'Start your trip and let AI Travel Sync adapt your plans in real-time based on weather, crowds, or mood changes.',
                icon: RefreshCw,
              },
            ].map((item, index) => (
              <div key={index} className="relative">
                {/* Connector Line */}
                {index < 2 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-px bg-sandstone" />
                )}
                <div className="text-center">
                  <div className="relative inline-flex items-center justify-center w-24 h-24 bg-eucalyptus/10 rounded-2xl mb-6">
                    <item.icon className="w-10 h-10 text-eucalyptus" />
                    <span className="absolute -top-2 -right-2 w-8 h-8 bg-eucalyptus text-white text-sm font-bold rounded-lg flex items-center justify-center">
                      {item.step}
                    </span>
                  </div>
                  <h3 
                    className="text-xl font-semibold text-midnight mb-2"
                    style={{ fontFamily: 'var(--font-heading)' }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-midnight/60 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-sandstone/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Star, title: 'Curated Quality', description: 'Every experience is hand-picked and tagged with care.' },
              { icon: Clock, title: 'Save Time', description: 'Get complete itineraries in seconds, not hours.' },
              { icon: Shield, title: 'Trusted Data', description: 'Real locations, verified information, honest ratings.' },
            ].map((item, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-eucalyptus/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-5 h-5 text-eucalyptus" />
                </div>
                <div>
                  <h4 className="font-semibold text-midnight mb-1">{item.title}</h4>
                  <p className="text-midnight/60 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-midnight rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 right-0 w-64 h-64 bg-eucalyptus rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-eucalyptus rounded-full blur-3xl" />
            </div>

            <div className="relative">
              <h2 
                className="text-3xl md:text-4xl font-bold text-white mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Ready to travel your way?
              </h2>
              <p className="text-white/60 text-lg mb-8 max-w-xl mx-auto">
                Start with a simple description of your dream trip. Our AI will handle the rest.
              </p>
              <Link
                to="/weaver"
                className="inline-flex items-center gap-2 px-8 py-4 bg-eucalyptus hover:bg-eucalyptus-dark text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-eucalyptus/20"
              >
                <Sparkles className="w-5 h-5" />
                Launch Experience Weaver
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
