import nlp from 'compromise';

// 95-tag dictionary organized by category
export const TAG_DICTIONARY = {
  // Tier 1: Emotional/Experiential Tags (Core mood descriptors)
  emotional: [
    'peaceful', 'serene', 'calm', 'quiet', 'tranquil',
    'relaxing', 'laid-back', 'chill',
    'romantic', 'intimate', 'cozy',
    'adventurous', 'thrilling', 'exciting', 'adrenaline',
    'cultural', 'traditional', 'heritage', 'authentic',
    'spiritual', 'sacred', 'meditative', 'zen',
    'luxurious', 'premium', 'upscale', 'elegant',
    'rustic', 'raw', 'natural', 'earthy',
    'social', 'lively', 'vibrant', 'energetic',
    'secluded', 'hidden', 'offbeat', 'unexplored'
  ],

  // Tier 2: Environment Tags
  environment: [
    'indoors', 'indoor',
    'outdoors', 'outdoor', 'open-air',
    'beach', 'coastal', 'seaside', 'ocean',
    'mountain', 'hills', 'highland', 'valley',
    'forest', 'jungle', 'woods', 'nature',
    'city', 'urban', 'metropolitan',
    'rural', 'countryside', 'village',
    'waterfront', 'lakeside', 'riverside'
  ],

  // Tier 3: Budget Tags
  budget: [
    'budget-friendly', 'budget', 'cheap', 'affordable', 'economical', 'free',
    'mid-range', 'moderate', 'reasonable',
    'premium', 'luxury', 'expensive', 'high-end', 'exclusive'
  ],

  // Tier 4: Social/Group Tags
  social: [
    'solo-friendly', 'solo',
    'couple-friendly', 'couples', 'romantic',
    'family-friendly', 'family', 'kid-friendly', 'children',
    'group-friendly', 'group', 'friends',
    'pet-friendly'
  ],

  // Tier 5: Activity Type Tags
  activity: [
    'adventure', 'sports', 'trekking', 'hiking', 'climbing',
    'water-sports', 'swimming', 'diving', 'snorkeling', 'surfing',
    'culture', 'museum', 'art', 'history', 'architecture',
    'food', 'culinary', 'dining', 'cuisine', 'foodie',
    'wellness', 'spa', 'yoga', 'meditation', 'healing',
    'nightlife', 'party', 'clubs', 'bars', 'dancing',
    'shopping', 'markets', 'bazaar', 'local-crafts',
    'photography', 'scenic', 'viewpoint', 'instagram',
    'wildlife', 'safari', 'birdwatching',
    'religious', 'temple', 'church', 'spiritual'
  ],

  // Tier 6: Time-based Tags
  temporal: [
    'sunrise', 'morning', 'early-morning',
    'afternoon', 'midday',
    'sunset', 'evening', 'golden-hour',
    'night', 'late-night', 'after-dark'
  ],

  // Tier 7: Accessibility Tags
  accessibility: [
    'wheelchair-accessible', 'accessible',
    'easy-access', 'beginner-friendly', 'easy',
    'moderate-difficulty', 'intermediate',
    'challenging', 'difficult', 'expert-only'
  ]
};

// Create a flat array of all tags for matching
export const ALL_TAGS = Object.values(TAG_DICTIONARY).flat();

// Tag synonyms for better matching
const TAG_SYNONYMS: Record<string, string> = {
  // Emotional synonyms
  'quiet': 'peaceful',
  'tranquil': 'peaceful',
  'calm': 'peaceful',
  'serene': 'peaceful',
  'chill': 'relaxing',
  'laid-back': 'relaxing',
  'intimate': 'romantic',
  'cozy': 'romantic',
  'thrilling': 'adventurous',
  'exciting': 'adventurous',
  'adrenaline': 'adventurous',
  'traditional': 'cultural',
  'heritage': 'cultural',
  'authentic': 'cultural',
  'sacred': 'spiritual',
  'meditative': 'spiritual',
  'zen': 'spiritual',
  'upscale': 'luxurious',
  'elegant': 'luxurious',
  'raw': 'rustic',
  'earthy': 'rustic',
  'lively': 'social',
  'vibrant': 'social',
  'energetic': 'social',
  'hidden': 'secluded',
  'offbeat': 'secluded',
  'unexplored': 'secluded',
  
  // Environment synonyms
  'coastal': 'beach',
  'seaside': 'beach',
  'ocean': 'beach',
  'hills': 'mountain',
  'highland': 'mountain',
  'valley': 'mountain',
  'jungle': 'forest',
  'woods': 'forest',
  'urban': 'city',
  'metropolitan': 'city',
  'countryside': 'rural',
  'village': 'rural',
  'lakeside': 'waterfront',
  'riverside': 'waterfront',
  
  // Budget synonyms
  'cheap': 'budget-friendly',
  'affordable': 'budget-friendly',
  'economical': 'budget-friendly',
  'free': 'budget-friendly',
  'moderate': 'mid-range',
  'reasonable': 'mid-range',
  'expensive': 'premium',
  'high-end': 'premium',
  'exclusive': 'luxury',
  
  // Activity synonyms
  'trekking': 'hiking',
  'climbing': 'hiking',
  'swimming': 'water-sports',
  'diving': 'water-sports',
  'snorkeling': 'water-sports',
  'surfing': 'water-sports',
  'museum': 'culture',
  'art': 'culture',
  'history': 'culture',
  'architecture': 'culture',
  'culinary': 'food',
  'dining': 'food',
  'cuisine': 'food',
  'foodie': 'food',
  'spa': 'wellness',
  'yoga': 'wellness',
  'meditation': 'wellness',
  'healing': 'wellness',
  'party': 'nightlife',
  'clubs': 'nightlife',
  'bars': 'nightlife',
  'dancing': 'nightlife',
  'markets': 'shopping',
  'bazaar': 'shopping',
  'local-crafts': 'shopping',
  'scenic': 'photography',
  'viewpoint': 'photography',
  'instagram': 'photography',
  'safari': 'wildlife',
  'birdwatching': 'wildlife',
  'temple': 'religious',
  'church': 'religious'
};

// Destination keywords
const DESTINATION_KEYWORDS: Record<string, string[]> = {
  'goa': ['goa', 'beach', 'beaches', 'coastal', 'seaside', 'ocean', 'sea', 'baga', 'calangute', 'panjim', 'arambol', 'anjuna', 'palolem'],
  'manali': ['manali', 'mountain', 'mountains', 'hills', 'himalaya', 'himalayas', 'snow', 'valley', 'kullu', 'solang', 'rohtang'],
  'pune': ['pune', 'city', 'urban', 'maharashtra', 'deccan', 'historical', 'shaniwar']
};

export interface NLPResult {
  tags: string[];
  destination: string | null;
  duration: number;
  budget: string | null;
  groupType: string | null;
  originalQuery: string;
  confidence: number;
}

export function extractFromQuery(query: string): NLPResult {
  const lowerQuery = query.toLowerCase();
  const doc = nlp(lowerQuery);
  
  const extractedTags: Set<string> = new Set();
  let destination: string | null = null;
  let duration = 3; // Default 3 days
  let budget: string | null = null;
  let groupType: string | null = null;
  
  // 1. Extract adjectives and nouns
  const adjectives = doc.adjectives().out('array') as string[];
  const nouns = doc.nouns().out('array') as string[];
  const allWords = [...adjectives, ...nouns];
  
  // Also split the query into individual words for matching
  const queryWords = lowerQuery.split(/\s+/);
  
  // 2. Match words against tag dictionary
  [...allWords, ...queryWords].forEach((word: string) => {
    const cleanWord = word.toLowerCase().trim();
    
    // Check if word is directly in our tags
    if (ALL_TAGS.includes(cleanWord)) {
      // Check if there's a synonym mapping
      const mappedTag = TAG_SYNONYMS[cleanWord] || cleanWord;
      extractedTags.add(mappedTag);
    }
    
    // Check synonyms
    Object.entries(TAG_SYNONYMS).forEach(([synonym, primary]) => {
      if (cleanWord === synonym || cleanWord.includes(synonym)) {
        extractedTags.add(primary);
      }
    });
  });
  
  // 3. Extract destination
  Object.entries(DESTINATION_KEYWORDS).forEach(([dest, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) {
        destination = dest.charAt(0).toUpperCase() + dest.slice(1);
      }
    });
  });
  
  // 4. Extract duration
  const durationPatterns = [
    /(\d+)\s*(?:day|days)/i,
    /(\d+)\s*(?:night|nights)/i,
    /(\d+)\s*(?:week|weeks)/i,
    /(?:a|one)\s*week/i,
    /weekend/i,
    /long\s*weekend/i
  ];
  
  for (const pattern of durationPatterns) {
    const match = query.match(pattern);
    if (match) {
      if (pattern.source.includes('week')) {
        if (match[1]) {
          duration = parseInt(match[1]) * 7;
        } else {
          duration = 7;
        }
      } else if (pattern.source.includes('weekend')) {
        duration = query.includes('long') ? 3 : 2;
      } else if (match[1]) {
        duration = parseInt(match[1]);
      }
      break;
    }
  }
  
  // 5. Extract budget preference
  const budgetWords = ['budget', 'cheap', 'affordable', 'luxury', 'luxurious', 'premium', 'expensive', 'mid-range', 'moderate'];
  budgetWords.forEach(word => {
    if (lowerQuery.includes(word)) {
      if (['budget', 'cheap', 'affordable'].includes(word)) {
        budget = 'budget-friendly';
        extractedTags.add('budget-friendly');
      } else if (['luxury', 'luxurious', 'premium', 'expensive'].includes(word)) {
        budget = 'premium';
        extractedTags.add('premium');
      } else {
        budget = 'mid-range';
        extractedTags.add('mid-range');
      }
    }
  });
  
  // 6. Extract group type
  const groupPatterns: Record<string, string[]> = {
    'solo': ['solo', 'alone', 'myself', 'by myself'],
    'couple': ['couple', 'romantic', 'honeymoon', 'partner', 'spouse', 'wife', 'husband', 'girlfriend', 'boyfriend'],
    'family': ['family', 'kids', 'children', 'parents'],
    'friends': ['friends', 'group', 'gang', 'buddies']
  };
  
  Object.entries(groupPatterns).forEach(([type, keywords]) => {
    keywords.forEach(keyword => {
      if (lowerQuery.includes(keyword)) {
        groupType = type;
        extractedTags.add(`${type}-friendly`);
      }
    });
  });
  
  // 7. Calculate confidence score
  const confidence = calculateConfidence(extractedTags.size, destination !== null, duration !== 3);
  
  return {
    tags: Array.from(extractedTags),
    destination,
    duration,
    budget,
    groupType,
    originalQuery: query,
    confidence
  };
}

function calculateConfidence(tagCount: number, hasDestination: boolean, hasDuration: boolean): number {
  let confidence = 0.5; // Base confidence
  
  // More tags = higher confidence
  confidence += Math.min(tagCount * 0.08, 0.32);
  
  // Having destination increases confidence
  if (hasDestination) confidence += 0.1;
  
  // Having explicit duration increases confidence
  if (hasDuration) confidence += 0.08;
  
  return Math.min(confidence, 0.98);
}

// Get tag category for display purposes
export function getTagCategory(tag: string): string {
  for (const [category, tags] of Object.entries(TAG_DICTIONARY)) {
    if (tags.includes(tag)) {
      return category;
    }
  }
  return 'other';
}

// Get tag color based on category
export function getTagColor(tag: string): string {
  const category = getTagCategory(tag);
  const colors: Record<string, string> = {
    emotional: 'bg-purple-100 text-purple-700',
    environment: 'bg-green-100 text-green-700',
    budget: 'bg-amber-100 text-amber-700',
    social: 'bg-blue-100 text-blue-700',
    activity: 'bg-rose-100 text-rose-700',
    temporal: 'bg-orange-100 text-orange-700',
    accessibility: 'bg-gray-100 text-gray-700',
    other: 'bg-eucalyptus/10 text-eucalyptus'
  };
  return colors[category] || colors.other;
}

// Example queries for user guidance
export const EXAMPLE_QUERIES = [
  "I want a peaceful beach trip for 3 days",
  "Adventurous mountain getaway with friends for a week",
  "Romantic weekend in Goa with good food",
  "Budget-friendly solo trip to explore culture",
  "Luxury spa and wellness retreat for 5 days",
  "Family-friendly vacation with kids activities"
];
