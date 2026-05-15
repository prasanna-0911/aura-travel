const nlp = require('compromise');
const { ALL_TAGS, TAG_SYNONYMS } = require('../utils/tagDictionary');

const DESTINATION_KEYWORDS = {
  // India
  goa: ['goa', 'beach', 'beaches', 'coastal', 'seaside', 'ocean', 'sea', 'baga', 'calangute', 'panjim', 'arambol', 'anjuna', 'palolem'],
  manali: ['manali', 'mountain', 'mountains', 'hills', 'himalaya', 'himalayas', 'snow', 'valley', 'kullu', 'solang', 'rohtang'],
  pune: ['pune', 'city', 'urban', 'maharashtra', 'deccan', 'historical', 'shaniwar'],
  // Asia
  bali: ['bali', 'denpasar', 'ubud', 'seminyak', 'kuta', 'nusa dua'],
  thailand: ['thailand', 'bangkok', 'phuket', 'krabi', 'chiang mai', 'pattaya', 'koh samui', 'koh phi phi'],
  tokyo: ['tokyo', 'japan', 'kyoto', 'osaka', 'hiroshima', 'nara', 'Mt Fuji', 'Mt. Fuji'],
  singapore: ['singapore', 'marina bay', 'gardens by the bay'],
  vietnam: ['vietnam', 'hanoi', 'ho chi minh', 'hochiminh', 'da nang', 'hoi an'],
  malaysia: ['malaysia', 'kuala lumpur', 'penang', 'langkawi'],
  indonesia: ['indonesia', 'jakarta', 'yogyakarta', 'bali', 'sumatra', 'java', 'borobudur'],
  korea: ['korea', 'seoul', 'busan', 'jeju'],
  // Europe
  paris: ['paris', 'france', 'louvre', 'eiffel', 'montmartre', 'champs'],
  london: ['london', 'uk', 'england', 'tower bridge', 'big ben', 'buckingham'],
  rome: ['rome', 'italy', 'colosseum', 'vatican', 'florence', 'venice', 'milan'],
  barcelona: ['barcelona', 'spain', 'la sagrada', 'park guell', 'las ramblas'],
  amsterdam: ['amsterdam', 'netherlands', 'nederland', 'anne frank'],
  prague: ['prague', 'czech', 'czechia', 'charles bridge'],
  vienna: ['vienna', 'austria', 'salzburg'],
  greece: ['greece', 'athens', 'santorini', 'mykonos', 'crete', 'acropolis'],
  turkey: ['turkey', 'istanbul', 'cappadocia', 'antalya', 'ephesus'],
  portugal: ['portugal', 'lisbon', 'porto', 'sintra', 'algarve'],
  // Americas
  'new york': ['new york', 'nyc', 'manhattan', 'brooklyn', 'times square', 'statue of liberty'],
  'los angeles': ['los angeles', 'la', 'hollywood', 'santa monica', 'venice beach'],
  'san francisco': ['san francisco', 'sf', 'golden gate', 'alcatraz'],
  miami: ['miami', 'florida', 'south beach', 'key west'],
  vegas: ['las vegas', 'vegas', 'strip', 'bellagio'],
  'rio de janeiro': ['rio', 'brazil', 'copacabana', 'christ the redeemer'],
  'mexico city': ['mexico city', 'mexico', 'cancun', 'tulum'],
  // Middle East
  dubai: ['dubai', 'uae', 'emirates', 'burj khalifa', 'palm'],
  // Oceania
  sydney: ['sydney', 'australia', 'opera house', 'harbour bridge'],
  auckland: ['auckland', 'new zealand', 'queenstown']
};

const DESTINATION_ALIASES = {
  'bangkok': 'thailand',
  'phuket': 'thailand',
  'krabi': 'thailand',
  'chiang mai': 'thailand',
  'kyoto': 'tokyo',
  'osaka': 'tokyo',
  'hanoi': 'vietnam',
  'ho chi minh': 'vietnam',
  'kuala lumpur': 'malaysia',
  'london': 'london',
  'rome': 'rome',
  'florence': 'rome',
  'venice': 'rome',
  'milan': 'rome',
  'barcelona': 'barcelona',
  'lisbon': 'portugal',
  'manhattan': 'new york',
  'hollywood': 'los angeles',
  'cancun': 'mexico city',
  'tulum': 'mexico city',
  'copacabana': 'rio de janeiro'
};

function titleCase(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function extractFromQuery(query = '') {
  const lowerQuery = String(query).toLowerCase();
  const doc = nlp(lowerQuery);
  const extractedTags = new Set();
  let destination = null;
  let duration = 3;
  let budget = null;
  let groupType = null;

  const adjectives = doc.adjectives().out('array');
  const nouns = doc.nouns().out('array');
  const queryWords = lowerQuery.split(/[^a-z0-9-]+/).filter(Boolean);

  [...adjectives, ...nouns, ...queryWords].forEach((word) => {
    const cleanWord = word.toLowerCase().trim();
    if (!cleanWord) return;

    if (ALL_TAGS.includes(cleanWord)) {
      extractedTags.add(TAG_SYNONYMS[cleanWord] || cleanWord);
    }

    Object.entries(TAG_SYNONYMS).forEach(([synonym, primary]) => {
      if (cleanWord === synonym || cleanWord.includes(synonym)) {
        extractedTags.add(primary);
      }
    });
  });

  // Check for exact destination matches first
  Object.entries(DESTINATION_KEYWORDS).forEach(([dest, keywords]) => {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      destination = titleCase(dest);
    }
  });

  // Check aliases (e.g., "bangkok" -> "Thailand") - reuse queryWords from line 83
  for (const word of queryWords) {
    if (DESTINATION_ALIASES[word] && !destination) {
      destination = titleCase(DESTINATION_ALIASES[word]);
      break;
    }
  }

  // Check if any word in query directly matches a destination (for single word like "Paris", "Bali")
  for (const dest of Object.keys(DESTINATION_KEYWORDS)) {
    if (queryWords.includes(dest) && !destination) {
      destination = titleCase(dest);
      break;
    }
  }

  const durationPatterns = [
    /(\d+)\s*(?:day|days)/i,
    /(\d+)\s*(?:night|nights)/i,
    /(\d+)\s*(?:week|weeks)/i,
    /(?:a|one)\s*week/i,
    /long\s*weekend/i,
    /weekend/i
  ];

  for (const pattern of durationPatterns) {
    const match = query.match(pattern);
    if (!match) continue;

    if (pattern.source.includes('week') && match[1]) duration = parseInt(match[1], 10) * 7;
    else if (pattern.source.includes('week')) duration = 7;
    else if (pattern.source.includes('long')) duration = 3;
    else if (pattern.source.includes('weekend')) duration = 2;
    else if (match[1]) duration = parseInt(match[1], 10);
    break;
  }

  const budgetWords = ['budget', 'cheap', 'affordable', 'luxury', 'luxurious', 'premium', 'expensive', 'mid-range', 'moderate'];
  budgetWords.forEach((word) => {
    if (!lowerQuery.includes(word)) return;
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
  });

  const groupPatterns = {
    solo: ['solo', 'alone', 'myself', 'by myself'],
    couple: ['couple', 'romantic', 'honeymoon', 'partner', 'spouse', 'wife', 'husband', 'girlfriend', 'boyfriend'],
    family: ['family', 'kids', 'children', 'parents'],
    friends: ['friends', 'group', 'gang', 'buddies']
  };

  Object.entries(groupPatterns).forEach(([type, keywords]) => {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      groupType = type;
      extractedTags.add(type === 'couple' ? 'couple-friendly' : `${type}-friendly`);
    }
  });

  const confidence = Math.min(
    0.5 + Math.min(extractedTags.size * 0.08, 0.32) + (destination ? 0.1 : 0) + (duration !== 3 ? 0.08 : 0),
    0.98
  );

  return {
    tags: Array.from(extractedTags),
    destination,
    duration: Math.max(1, Math.min(duration, 7)),
    budget,
    groupType,
    originalQuery: query,
    confidence
  };
}

module.exports = { extractFromQuery };
