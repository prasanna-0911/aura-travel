import { useState, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Loader2,
  MapPin,
  Clock,
  Tag,
  Lightbulb,
  ChevronRight,
  AlertCircle,
  RefreshCw,
  WifiOff
} from 'lucide-react';
import { extractFromQuery, EXAMPLE_QUERIES, getTagColor, NLPResult } from '@/utils/nlp';
import { generateItinerary, GeneratedItinerary } from '@/services/weaverService';
import { cn } from '@/utils/cn';
import { ItineraryResults } from '@/components/weaver/ItineraryResults';
import { toast } from '@/components/notifications/Toast';
import { isOnline, onOnlineStatusChange } from '@/services/apiClient';

export function Weaver() {
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [nlpResult, setNlpResult] = useState<NLPResult | null>(null);
  const [itinerary, setItinerary] = useState<GeneratedItinerary | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [online, setOnline] = useState(true);

  // Monitor online status
  useEffect(() => {
    setOnline(isOnline());
    const cleanup = onOnlineStatusChange(setOnline);
    return cleanup;
  }, []);

  // Real-time NLP analysis as user types
  useEffect(() => {
    if (query.length > 10) {
      const timer = setTimeout(() => {
        const result = extractFromQuery(query);
        setNlpResult(result);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setNlpResult(null);
    }
  }, [query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || isGenerating) return;

    if (!online) {
      toast.error('No Internet', 'Please check your connection and try again.');
      return;
    }

    setError(null);
    setIsAnalyzing(true);

    // Extract tags from query
    const result = extractFromQuery(query);
    setNlpResult(result);

    setTimeout(async () => {
      setIsAnalyzing(false);
      setIsGenerating(true);

      try {
        const generatedItinerary = await generateItinerary(result);
        setItinerary(generatedItinerary);
        setShowResults(true);
        toast.success(
          'Itinerary Ready!',
          `${generatedItinerary.destination} - ${generatedItinerary.days.length} days with ${generatedItinerary.days.reduce((a, d) => a + d.activities.length, 0)} activities`
        );
      } catch (err) {
        console.error('Error generating itinerary:', err);
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        if (errorMessage.includes('timed out')) {
          setError('The request is taking too long. Please try again or check your connection.');
          toast.error('Request Timeout', 'Generation timed out. Please try again.');
        } else if (errorMessage.includes('failed') || errorMessage.includes('network')) {
          setError('Network error. Please check your connection and try again.');
          toast.error('Connection Error', 'Could not connect to server. Please try again.');
        } else {
          setError('Something went wrong. Please try again.');
          toast.error('Generation Failed', 'Could not create itinerary. Please try again.');
        }
      } finally {
        setIsGenerating(false);
      }
    }, 800);
  };

  const handleRetry = () => {
    setError(null);
    handleSubmit(new Event('submit') as unknown as React.FormEvent);
  };

  const handleExampleClick = (example: string) => {
    setQuery(example);
  };

  const handleReset = () => {
    setShowResults(false);
    setItinerary(null);
    setQuery('');
    setNlpResult(null);
  };

  if (showResults && itinerary) {
    return <ItineraryResults itinerary={itinerary} onReset={handleReset} />;
  }

  return (
    <div className="min-h-screen bg-pearl">
      {/* Hero Section */}
      <section className="hero-gradient pt-12 pb-8 md:pt-20 md:pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-eucalyptus/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-eucalyptus" />
            <span className="text-sm font-medium text-eucalyptus">AI Experience Weaver</span>
          </div>

          {/* Headline */}
          <h1 
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-midnight mb-4"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Tell us your dream trip
          </h1>

          {/* Subheadline */}
          <p className="text-midnight/60 text-lg max-w-2xl mx-auto">
            Describe what you're looking for in your own words. Our AI understands your mood, 
            preferences, and creates the perfect itinerary just for you.
          </p>
        </div>
      </section>

      {/* Offline Banner */}
      {!online && (
        <div className="flex items-center justify-center gap-2 p-3 bg-ember/10 border-b border-ember/20">
          <WifiOff className="w-5 h-5 text-ember" />
          <span className="text-sm text-ember font-medium">You are offline. Please check your connection.</span>
        </div>
      )}

      {/* Main Input Section */}
      <section className="py-8 md:py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-ember/10 border border-ember/20 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-ember flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-midnight">{error}</p>
                  <button
                    onClick={handleRetry}
                    disabled={isGenerating}
                    className="mt-2 flex items-center gap-2 text-sm text-eucalyptus hover:text-eucalyptus-dark font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Try Again
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Input Card */}
          <div className="bg-white rounded-2xl shadow-xl shadow-midnight/5 border border-sandstone/50 overflow-hidden">
            <form onSubmit={handleSubmit}>
              {/* Text Input Area */}
              <div className="p-6">
                <label className="block text-sm font-medium text-midnight/60 mb-3">
                  What kind of experience are you looking for?
                </label>
                <textarea
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., I want a peaceful beach trip with cultural experiences for 3 days..."
                  className="w-full h-32 p-4 bg-sandstone/20 rounded-xl border border-sandstone/50 focus:border-eucalyptus focus:ring-2 focus:ring-eucalyptus/20 outline-none resize-none text-midnight placeholder:text-midnight/40 transition-all"
                  disabled={isAnalyzing || isGenerating}
                />
              </div>

              {/* Real-time Tag Preview */}
              {nlpResult && nlpResult.tags.length > 0 && (
                <div className="px-6 pb-4 animate-fade-in">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="w-4 h-4 text-eucalyptus" />
                    <span className="text-sm font-medium text-midnight/70">Detected from your query:</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nlpResult.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className={cn(
                          "px-3 py-1 rounded-full text-sm font-medium",
                          getTagColor(tag)
                        )}
                      >
                        {tag}
                      </span>
                    ))}
                    {nlpResult.destination && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-eucalyptus/10 text-eucalyptus flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {nlpResult.destination}
                      </span>
                    )}
                    {nlpResult.duration && (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-midnight/10 text-midnight flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {nlpResult.duration} days
                      </span>
                    )}
                  </div>
                  {/* Confidence indicator */}
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-sandstone/50 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-eucalyptus rounded-full transition-all duration-500"
                        style={{ width: `${nlpResult.confidence * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-midnight/50">
                      {Math.round(nlpResult.confidence * 100)}% confidence
                    </span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="p-6 pt-0">
                <button
                  type="submit"
                  disabled={!query.trim() || isAnalyzing || isGenerating || !online}
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-4 rounded-xl font-semibold transition-all duration-200",
                    query.trim() && !isAnalyzing && !isGenerating && online
                      ? "bg-eucalyptus hover:bg-eucalyptus-dark text-white hover:shadow-lg hover:shadow-eucalyptus/20"
                      : "bg-sandstone/50 text-midnight/40 cursor-not-allowed"
                  )}
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing your preferences...
                    </>
                  ) : isGenerating ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Weaving your perfect itinerary...
                    </>
                  ) : !online ? (
                    <>
                      <WifiOff className="w-5 h-5" />
                      You are offline
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Generate My Itinerary
                      <Send className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Example Queries */}
          <div className="mt-8">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb className="w-4 h-4 text-eucalyptus" />
              <span className="text-sm font-medium text-midnight/70">Try these examples:</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {EXAMPLE_QUERIES.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="group flex items-center justify-between p-4 bg-white rounded-xl border border-sandstone/50 hover:border-eucalyptus/30 hover:shadow-md transition-all duration-200 text-left"
                >
                  <span className="text-sm text-midnight/70 group-hover:text-midnight">
                    "{example}"
                  </span>
                  <ChevronRight className="w-4 h-4 text-midnight/30 group-hover:text-eucalyptus group-hover:translate-x-1 transition-all" />
                </button>
              ))}
            </div>
          </div>

          {/* How It Works */}
          <div className="mt-12 p-6 bg-sandstone/30 rounded-2xl">
            <h3 
              className="text-lg font-semibold text-midnight mb-4"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              How it works
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { step: '1', title: 'Describe', desc: 'Tell us what you want in natural language' },
                { step: '2', title: 'Analyze', desc: 'Our AI extracts your preferences and mood' },
                { step: '3', title: 'Generate', desc: 'Get a personalized day-by-day itinerary' },
              ].map((item) => (
                <div key={item.step} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-eucalyptus text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-medium text-midnight">{item.title}</h4>
                    <p className="text-sm text-midnight/60">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
