export interface Restaurant {
  id: string;
  name: string;
  destination: string;
  cuisine: string[];
  experiential_tags: string[];
  price_range: string;
  avg_cost_per_person: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  user_rating: number;
  description: string;
  best_for: string;
}

export const restaurants: Restaurant[] = [
  // ============================================
  // GOA RESTAURANTS (6 entries)
  // ============================================
  {
    id: 'rest-goa-001',
    name: 'Gunpowder',
    destination: 'Goa',
    cuisine: ['South Indian', 'Kerala', 'Chettinad'],
    experiential_tags: ['cultural', 'authentic', 'food', 'couple-friendly', 'indoor'],
    price_range: '₹₹₹',
    avg_cost_per_person: 1200,
    location: { lat: 15.5015, lng: 73.8290, address: 'Near Panjim Church, Panjim, Goa' },
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'],
    user_rating: 4.6,
    description: 'Set in a charming Portuguese house, Gunpowder serves exquisite South Indian coastal cuisine. Their Kerala and Chettinad dishes are legendary in Goa.',
    best_for: 'Dinner, Special Occasions'
  },
  {
    id: 'rest-goa-002',
    name: 'Fisherman\'s Wharf',
    destination: 'Goa',
    cuisine: ['Goan', 'Seafood', 'Continental'],
    experiential_tags: ['romantic', 'waterfront', 'food', 'premium', 'couple-friendly', 'evening'],
    price_range: '₹₹₹',
    avg_cost_per_person: 1500,
    location: { lat: 15.4498, lng: 73.8036, address: 'Cavelossim, Mobor, South Goa' },
    images: ['https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&auto=format&fit=crop'],
    user_rating: 4.5,
    description: 'Iconic waterfront restaurant known for fresh seafood and stunning sunset views. The Goan fish curry rice is a must-try.',
    best_for: 'Romantic Dinners, Seafood'
  },
  {
    id: 'rest-goa-003',
    name: 'Curlies Beach Shack',
    destination: 'Goa',
    cuisine: ['Goan', 'Indian', 'Continental'],
    experiential_tags: ['beach', 'social', 'nightlife', 'budget-friendly', 'group-friendly'],
    price_range: '₹₹',
    avg_cost_per_person: 600,
    location: { lat: 15.5834, lng: 73.7413, address: 'Anjuna Beach, North Goa' },
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop'],
    user_rating: 4.2,
    description: 'Legendary beach shack that transforms into a party spot after dark. Great food, drinks, and the quintessential Goa beach experience.',
    best_for: 'Beach Vibes, Nightlife'
  },
  {
    id: 'rest-goa-004',
    name: 'Vinayak Family Restaurant',
    destination: 'Goa',
    cuisine: ['Goan', 'Indian', 'Vegetarian Options'],
    experiential_tags: ['budget-friendly', 'authentic', 'family-friendly', 'local'],
    price_range: '₹',
    avg_cost_per_person: 300,
    location: { lat: 15.2993, lng: 74.0879, address: 'Margao Market, Goa' },
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'A local favorite since decades. Authentic Goan home-style cooking at unbeatable prices. Their thali is legendary among locals.',
    best_for: 'Lunch, Authentic Local Food'
  },
  {
    id: 'rest-goa-005',
    name: 'Thalassa',
    destination: 'Goa',
    cuisine: ['Greek', 'Mediterranean', 'Seafood'],
    experiential_tags: ['romantic', 'premium', 'photography', 'couple-friendly', 'evening', 'waterfront'],
    price_range: '₹₹₹₹',
    avg_cost_per_person: 2000,
    location: { lat: 15.6027, lng: 73.7358, address: 'Small Vagator, North Goa' },
    images: ['https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&auto=format&fit=crop'],
    user_rating: 4.7,
    description: 'Cliff-top Greek restaurant with breathtaking sunset views. White-washed decor, Mediterranean cuisine, and Santorini vibes in Goa.',
    best_for: 'Sunset Dinner, Special Occasions'
  },
  {
    id: 'rest-goa-006',
    name: 'Britto\'s',
    destination: 'Goa',
    cuisine: ['Goan', 'Seafood', 'Continental'],
    experiential_tags: ['beach', 'social', 'family-friendly', 'mid-range', 'casual'],
    price_range: '₹₹',
    avg_cost_per_person: 800,
    location: { lat: 15.5557, lng: 73.7537, address: 'Baga Beach, North Goa' },
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop'],
    user_rating: 4.1,
    description: 'Iconic Baga Beach institution serving generous portions of seafood and cocktails. The perfect spot for a lazy beach lunch.',
    best_for: 'Beach Lunch, Casual Dining'
  },

  // ============================================
  // MANALI RESTAURANTS (4 entries)
  // ============================================
  {
    id: 'rest-manali-001',
    name: 'Johnson\'s Café',
    destination: 'Manali',
    cuisine: ['Continental', 'Italian', 'Indian'],
    experiential_tags: ['romantic', 'peaceful', 'heritage', 'couple-friendly', 'cozy'],
    price_range: '₹₹₹',
    avg_cost_per_person: 1000,
    location: { lat: 32.2396, lng: 77.1887, address: 'Circuit House Road, Manali' },
    images: ['https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&auto=format&fit=crop'],
    user_rating: 4.6,
    description: 'Cozy café in a colonial lodge with fireplace, garden seating, and mountain views. Famous for trout, apple pie, and warm hospitality.',
    best_for: 'Romantic Dinner, Cozy Evenings'
  },
  {
    id: 'rest-manali-002',
    name: 'Lazy Dog Lounge',
    destination: 'Manali',
    cuisine: ['Italian', 'Continental', 'Israeli'],
    experiential_tags: ['social', 'relaxing', 'solo-friendly', 'budget-friendly', 'casual'],
    price_range: '₹₹',
    avg_cost_per_person: 500,
    location: { lat: 32.2615, lng: 77.1842, address: 'Old Manali, Manali' },
    images: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'Bohemian café popular with backpackers and digital nomads. Great pizzas, shakshuka, and chill vibes with river views.',
    best_for: 'Casual Meals, Hanging Out'
  },
  {
    id: 'rest-manali-003',
    name: 'Drifters\' Inn Café',
    destination: 'Manali',
    cuisine: ['Multi-cuisine', 'Indian', 'Chinese'],
    experiential_tags: ['adventurous', 'social', 'group-friendly', 'casual', 'budget-friendly'],
    price_range: '₹₹',
    avg_cost_per_person: 450,
    location: { lat: 32.2615, lng: 77.1842, address: 'Old Manali, Manali' },
    images: ['https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=800&auto=format&fit=crop'],
    user_rating: 4.3,
    description: 'Traveler-friendly café with great food and adventure planning assistance. Walls covered with travel stories and trip photos.',
    best_for: 'Meeting Travelers, Planning Adventures'
  },
  {
    id: 'rest-manali-004',
    name: 'Chopsticks',
    destination: 'Manali',
    cuisine: ['Tibetan', 'Chinese', 'Japanese'],
    experiential_tags: ['cultural', 'food', 'family-friendly', 'mid-range', 'authentic'],
    price_range: '₹₹',
    avg_cost_per_person: 600,
    location: { lat: 32.2396, lng: 77.1887, address: 'Mall Road, Manali' },
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'],
    user_rating: 4.5,
    description: 'Authentic Tibetan and Asian cuisine in the heart of town. Their momos and thukpa are considered the best in Manali.',
    best_for: 'Tibetan Food, Family Meals'
  },

  // ============================================
  // PUNE RESTAURANTS (4 entries)
  // ============================================
  {
    id: 'rest-pune-001',
    name: 'Malaka Spice',
    destination: 'Pune',
    cuisine: ['Asian', 'Thai', 'Vietnamese', 'Japanese'],
    experiential_tags: ['romantic', 'premium', 'food', 'couple-friendly', 'photography'],
    price_range: '₹₹₹',
    avg_cost_per_person: 1200,
    location: { lat: 18.5362, lng: 73.8939, address: 'Lane 5, Koregaon Park, Pune' },
    images: ['https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop'],
    user_rating: 4.6,
    description: 'Pune\'s most iconic restaurant set in a beautiful garden with fairy lights. Award-winning Pan-Asian cuisine in a magical setting.',
    best_for: 'Date Night, Special Occasions'
  },
  {
    id: 'rest-pune-002',
    name: 'Vaishali',
    destination: 'Pune',
    cuisine: ['South Indian', 'Snacks', 'Beverages'],
    experiential_tags: ['authentic', 'cultural', 'budget-friendly', 'family-friendly', 'local'],
    price_range: '₹',
    avg_cost_per_person: 200,
    location: { lat: 18.5166, lng: 73.8416, address: 'FC Road, Pune' },
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'Legendary Pune institution since 1951. Famous for dosas, filter coffee, and being the hangout spot for generations of Punekars.',
    best_for: 'Breakfast, Authentic South Indian'
  },
  {
    id: 'rest-pune-003',
    name: 'German Bakery',
    destination: 'Pune',
    cuisine: ['European', 'Bakery', 'Café'],
    experiential_tags: ['relaxing', 'social', 'solo-friendly', 'cultural', 'casual'],
    price_range: '₹₹',
    avg_cost_per_person: 500,
    location: { lat: 18.5362, lng: 73.8939, address: 'North Main Road, Koregaon Park, Pune' },
    images: ['https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=800&auto=format&fit=crop'],
    user_rating: 4.3,
    description: 'Iconic Pune café rebuilt after 2010. Fresh bakes, organic options, and a bohemian atmosphere that attracts artists and seekers.',
    best_for: 'Breakfast, Coffee & Pastries'
  },
  {
    id: 'rest-pune-004',
    name: 'Shabree',
    destination: 'Pune',
    cuisine: ['Maharashtrian', 'Thali', 'Vegetarian'],
    experiential_tags: ['authentic', 'cultural', 'family-friendly', 'food', 'local'],
    price_range: '₹₹',
    avg_cost_per_person: 400,
    location: { lat: 18.5195, lng: 73.8553, address: 'JM Road, Shivajinagar, Pune' },
    images: ['https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop'],
    user_rating: 4.5,
    description: 'Authentic Maharashtrian thali experience. Unlimited refills of traditional dishes served on banana leaf. A culinary heritage experience.',
    best_for: 'Lunch, Traditional Maharashtrian'
  }
];

// Template for adding new restaurants
export const RESTAURANT_TEMPLATE: Restaurant = {
  id: 'rest-destination-XXX',
  name: 'Restaurant Name',
  destination: 'Destination', // Goa, Manali, or Pune
  cuisine: ['Cuisine 1', 'Cuisine 2'],
  experiential_tags: [], // Add 5-8 tags
  price_range: '₹₹', // ₹, ₹₹, ₹₹₹, or ₹₹₹₹
  avg_cost_per_person: 500,
  location: { lat: 0, lng: 0, address: 'Full address' },
  images: ['https://images.unsplash.com/photo-xxx'],
  user_rating: 4.0,
  description: 'Brief description (1-2 sentences).',
  best_for: 'Occasion type'
};
