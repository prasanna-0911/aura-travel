const nlp = require('compromise');
const { ALL_TAGS, TAG_SYNONYMS } = require('../utils/tagDictionary');

const DESTINATION_KEYWORDS = {
  goa: ['goa', 'beach', 'beaches', 'coastal', 'seaside', 'ocean', 'sea', 'baga', 'calangute', 'panjim', 'arambol', 'anjuna', 'palolem'],
  manali: ['manali', 'mountain', 'mountains', 'hills', 'himalaya', 'himalayas', 'snow', 'valley', 'kullu', 'solang', 'rohtang'],
  pune: ['pune', 'city', 'urban', 'maharashtra', 'deccan', 'historical', 'shaniwar']
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

  Object.entries(DESTINATION_KEYWORDS).forEach(([dest, keywords]) => {
    if (keywords.some((keyword) => lowerQuery.includes(keyword))) {
      destination = titleCase(dest);
    }
  });

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
