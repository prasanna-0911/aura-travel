const IMAGES = {
  Goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop',
  Manali: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop',
  Pune: 'https://images.unsplash.com/photo-1567157577867-05ccb1388e66?w=800&auto=format&fit=crop'
};

const BASE_COORDS = {
  Goa: { lat: 15.4909, lng: 73.8278 },
  Manali: { lat: 32.2396, lng: 77.1887 },
  Pune: { lat: 18.5204, lng: 73.8567 }
};

const ACTIVITY_SPECS = [
  ['goa-021', 'Fontainhas Art Lane Walk', 'Goa', 'cultural', ['cultural', 'heritage', 'architecture', 'photography', 'walking', 'budget-friendly', 'morning'], 2, 300, 'Fontainhas, Panjim', 'morning'],
  ['goa-022', 'Mandovi Sunset Cruise', 'Goa', 'leisure', ['sunset', 'waterfront', 'romantic', 'social', 'family-friendly', 'evening'], 2, 900, 'Mandovi River, Panjim', 'evening'],
  ['goa-023', 'Reis Magos Fort Viewpoint', 'Goa', 'cultural', ['heritage', 'photography', 'scenic', 'outdoors', 'peaceful', 'afternoon'], 2, 150, 'Reis Magos, North Goa', 'afternoon'],
  ['goa-024', 'Arambol Drum Circle Evening', 'Goa', 'nightlife', ['social', 'music', 'beach', 'offbeat', 'evening', 'budget-friendly'], 2, 0, 'Arambol Beach, North Goa', 'evening'],
  ['goa-025', 'Divar Island Bicycle Trail', 'Goa', 'adventure', ['rural', 'outdoors', 'cycling', 'peaceful', 'village', 'morning'], 4, 1200, 'Divar Island, Goa', 'morning'],
  ['goa-026', 'Cabo de Rama Cliff Picnic', 'Goa', 'leisure', ['secluded', 'cliff', 'scenic', 'romantic', 'outdoors', 'sunset'], 3, 500, 'Cabo de Rama, South Goa', 'evening'],
  ['goa-027', 'Mapusa Market Food Trail', 'Goa', 'food', ['food', 'markets', 'local-crafts', 'cultural', 'budget-friendly', 'morning'], 3, 800, 'Mapusa Market, North Goa', 'morning'],
  ['goa-028', 'Chorao Mangrove Kayaking', 'Goa', 'adventure', ['water-sports', 'wildlife', 'nature', 'outdoors', 'birdwatching', 'morning'], 3, 1800, 'Chorao Island, Goa', 'morning'],
  ['goa-029', 'Palolem Silent Disco', 'Goa', 'nightlife', ['nightlife', 'party', 'beach', 'social', 'late-night', 'group-friendly'], 3, 1200, 'Palolem Beach, South Goa', 'evening'],
  ['goa-030', 'Spice Village Cooking Session', 'Goa', 'food', ['food', 'cultural', 'indoors', 'authentic', 'family-friendly', 'afternoon'], 4, 2200, 'Ponda, Goa', 'afternoon'],
  ['goa-031', 'Butterfly Beach Boat Hop', 'Goa', 'leisure', ['beach', 'secluded', 'waterfront', 'photography', 'romantic', 'morning'], 4, 2500, 'Butterfly Beach, South Goa', 'morning'],
  ['goa-032', 'Latin Quarter Cafe Crawl', 'Goa', 'food', ['food', 'cultural', 'city', 'relaxing', 'couple-friendly', 'afternoon'], 3, 1500, 'Panjim, Goa', 'afternoon'],
  ['manali-013', 'Jogini Falls Village Trek', 'Manali', 'adventure', ['hiking', 'waterfall', 'nature', 'outdoors', 'photography', 'morning'], 4, 600, 'Vashisht, Manali', 'morning'],
  ['manali-014', 'Old Manali Cafe Hop', 'Manali', 'food', ['food', 'social', 'mountain', 'relaxing', 'afternoon', 'budget-friendly'], 3, 1000, 'Old Manali, Himachal Pradesh', 'afternoon'],
  ['manali-015', 'Sissu Valley Day Drive', 'Manali', 'leisure', ['scenic', 'mountain', 'photography', 'road-trip', 'peaceful', 'morning'], 7, 3500, 'Sissu Valley, Himachal Pradesh', 'morning'],
  ['manali-016', 'Hamta Village Culture Walk', 'Manali', 'cultural', ['village', 'cultural', 'rural', 'mountain', 'authentic', 'morning'], 3, 900, 'Hamta Village, Manali', 'morning'],
  ['manali-017', 'Apple Orchard Picnic', 'Manali', 'leisure', ['nature', 'peaceful', 'family-friendly', 'rural', 'photography', 'afternoon'], 2, 700, 'Naggar Road, Manali', 'afternoon'],
  ['manali-018', 'Beas River Fly Fishing', 'Manali', 'adventure', ['riverside', 'outdoors', 'peaceful', 'sports', 'morning'], 4, 2500, 'Beas River, Manali', 'morning'],
  ['manali-019', 'Naggar Castle Heritage Visit', 'Manali', 'cultural', ['heritage', 'architecture', 'mountain', 'photography', 'family-friendly'], 3, 250, 'Naggar Castle, Himachal Pradesh', 'afternoon'],
  ['manali-020', 'Pine Forest Meditation', 'Manali', 'wellness', ['wellness', 'meditation', 'forest', 'peaceful', 'spiritual', 'morning'], 2, 500, 'Van Vihar, Manali', 'morning'],
  ['manali-021', 'Solang Zipline Circuit', 'Manali', 'adventure', ['adventure', 'thrilling', 'mountain', 'sports', 'group-friendly'], 3, 2800, 'Solang Valley, Manali', 'afternoon'],
  ['manali-022', 'Tibetan Monastery Prayer Hour', 'Manali', 'spiritual', ['spiritual', 'cultural', 'indoors', 'peaceful', 'meditative'], 1.5, 0, 'Gadhan Thekchhokling Monastery, Manali', 'morning'],
  ['manali-023', 'Rahala Falls Photo Stop', 'Manali', 'leisure', ['waterfall', 'scenic', 'photography', 'outdoors', 'mountain'], 2, 200, 'Rahala Falls, Himachal Pradesh', 'afternoon'],
  ['manali-024', 'Mountain Stargazing Camp', 'Manali', 'adventure', ['camping', 'night', 'romantic', 'nature', 'secluded', 'group-friendly'], 5, 3200, 'Sethan, Himachal Pradesh', 'evening'],
  ['pune-009', 'Pataleshwar Cave Temple Visit', 'Pune', 'cultural', ['heritage', 'religious', 'architecture', 'indoors', 'budget-friendly'], 1.5, 0, 'Jangali Maharaj Road, Pune', 'morning'],
  ['pune-010', 'FC Road Street Food Walk', 'Pune', 'food', ['food', 'city', 'social', 'budget-friendly', 'evening'], 2, 600, 'Fergusson College Road, Pune', 'evening'],
  ['pune-011', 'Khadakwasla Sunset Drive', 'Pune', 'leisure', ['waterfront', 'sunset', 'romantic', 'scenic', 'outdoors'], 3, 500, 'Khadakwasla Dam, Pune', 'evening'],
  ['pune-012', 'Aga Khan Palace History Tour', 'Pune', 'cultural', ['history', 'heritage', 'architecture', 'family-friendly', 'photography'], 2, 100, 'Aga Khan Palace, Pune', 'morning'],
  ['pune-013', 'Vetal Tekdi Morning Hike', 'Pune', 'adventure', ['hiking', 'nature', 'city', 'outdoors', 'morning', 'budget-friendly'], 2, 0, 'Vetal Tekdi, Pune', 'morning'],
  ['pune-014', 'Koregaon Park Cafe Trail', 'Pune', 'food', ['food', 'city', 'premium', 'social', 'afternoon'], 3, 1800, 'Koregaon Park, Pune', 'afternoon'],
  ['pune-015', 'Raja Dinkar Kelkar Museum', 'Pune', 'cultural', ['museum', 'art', 'indoors', 'heritage', 'family-friendly'], 2, 150, 'Bajirao Road, Pune', 'afternoon'],
  ['pune-016', 'Sinhagad Fort Sunrise Trek', 'Pune', 'adventure', ['hiking', 'heritage', 'scenic', 'outdoors', 'sunrise'], 5, 400, 'Sinhagad Fort, Pune', 'morning'],
  ['pune-017', 'Osho Garden Quiet Walk', 'Pune', 'wellness', ['peaceful', 'garden', 'wellness', 'city', 'relaxing'], 1.5, 0, 'Koregaon Park, Pune', 'morning'],
  ['pune-018', 'Tulshibaug Local Market', 'Pune', 'shopping', ['shopping', 'markets', 'local-crafts', 'budget-friendly', 'cultural'], 2, 500, 'Tulshibaug, Pune', 'afternoon'],
  ['pune-019', 'Baner-Pashan Biodiversity Trail', 'Pune', 'wildlife', ['nature', 'birdwatching', 'outdoors', 'peaceful', 'morning'], 2, 0, 'Pashan, Pune', 'morning'],
  ['pune-020', 'Balewadi Live Music Night', 'Pune', 'nightlife', ['nightlife', 'music', 'social', 'city', 'group-friendly'], 3, 1600, 'Balewadi High Street, Pune', 'evening']
];

function destinationOffset(destination, id) {
  const numeric = Number(String(id).replace(/\D/g, '').slice(-2)) || 1;
  const base = BASE_COORDS[destination];
  return {
    lat: Number((base.lat + (numeric % 6) * 0.012).toFixed(4)),
    lng: Number((base.lng + (numeric % 5) * 0.011).toFixed(4))
  };
}

function makeActivity(spec) {
  const [id, name, destination, category, tags, duration, cost, address, bestTime] = spec;
  return {
    id,
    name,
    destination,
    category,
    description: `${name} adds a ${tags.slice(0, 3).join(', ')} experience to ${destination}, designed to balance practical timing with the mood requested by the traveller.`,
    experiential_tags: tags,
    duration_hours: duration,
    cost_inr: cost,
    opening_hours: { weekday: '09:00-18:00', weekend: '09:00-18:00' },
    location: { ...destinationOffset(destination, id), address },
    images: [IMAGES[destination]],
    user_rating: 4.3 + ((Number(id.replace(/\D/g, '').slice(-1)) || 1) % 6) / 10,
    accessibility: tags.includes('hiking') || tags.includes('adventure') ? 'moderate-difficulty' : 'easy-access',
    best_time: bestTime
  };
}

const additionalActivities = ACTIVITY_SPECS.map(makeActivity);

const additionalHotels = [
  ['hotel-goa-009', 'The Panjim Courtyard', 'Goa', ['heritage', 'city', 'cultural', 'mid-range'], 4, 4200, 'Fontainhas, Panjim'],
  ['hotel-manali-006', 'Cedar Ridge Homestay', 'Manali', ['mountain', 'peaceful', 'rustic', 'budget-friendly'], 3, 2600, 'Old Manali'],
  ['hotel-pune-005', 'Koregaon Boutique Stay', 'Pune', ['city', 'premium', 'food', 'social'], 4, 5600, 'Koregaon Park, Pune'],
  ['hotel-goa-010', 'Palolem Cove Resort', 'Goa', ['beach', 'romantic', 'secluded', 'premium'], 4, 7200, 'Palolem, South Goa']
].map(([id, name, destination, tags, stars, price, address]) => ({
  id,
  name,
  destination,
  description: `${name} is a curated stay for ${tags.slice(0, 2).join(' and ')} travel in ${destination}.`,
  experiential_tags: tags,
  star_rating: stars,
  price_per_night: price,
  amenities: ['WiFi', 'Breakfast', 'Concierge', 'Airport Transfer'],
  location: { ...destinationOffset(destination, id), address },
  images: [IMAGES[destination]],
  user_rating: 4.4
}));

const additionalRestaurants = [
  ['rest-goa-007', 'Panjim Spice Table', 'Goa', ['Goan', 'Seafood'], ['food', 'cultural', 'city', 'mid-range'], 900, 'Panjim, Goa', 'local dinner'],
  ['rest-manali-005', 'Cedar Hearth Cafe', 'Manali', ['Himachali', 'Cafe'], ['food', 'mountain', 'cozy', 'budget-friendly'], 650, 'Old Manali', 'slow lunch'],
  ['rest-pune-005', 'Deccan Thali House', 'Pune', ['Maharashtrian'], ['food', 'cultural', 'family-friendly', 'budget-friendly'], 550, 'Deccan Gymkhana, Pune', 'family meal'],
  ['rest-goa-008', 'Cove Candle Kitchen', 'Goa', ['Continental', 'Goan'], ['romantic', 'beach', 'premium', 'evening'], 1600, 'South Goa', 'date night']
].map(([id, name, destination, cuisine, tags, cost, address, bestFor]) => ({
  id,
  name,
  destination,
  description: `${name} is selected for ${bestFor} with a strong ${cuisine.join(' and ')} identity.`,
  cuisine,
  experiential_tags: tags,
  price_range: cost > 1200 ? 'RsRsRs' : 'RsRs',
  avg_cost_per_person: cost,
  location: { ...destinationOffset(destination, id), address },
  images: [IMAGES[destination]],
  user_rating: 4.5,
  best_for: bestFor
}));

module.exports = { additionalActivities, additionalHotels, additionalRestaurants };
