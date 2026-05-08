export interface Hotel {
  id: string;
  name: string;
  destination: string;
  experiential_tags: string[];
  star_rating: number;
  price_per_night: number;
  amenities: string[];
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  images: string[];
  user_rating: number;
  description: string;
}

export const hotels: Hotel[] = [
  // ============================================
  // GOA HOTELS (8 entries)
  // ============================================
  {
    id: 'hotel-goa-001',
    name: 'Taj Fort Aguada Resort & Spa',
    destination: 'Goa',
    experiential_tags: ['luxurious', 'beach', 'premium', 'romantic', 'wellness', 'couple-friendly'],
    star_rating: 5,
    price_per_night: 15000,
    amenities: ['Pool', 'Spa', 'Beach Access', 'Gym', 'Restaurant', 'Bar', 'WiFi', 'Room Service'],
    location: { lat: 15.4929, lng: 73.7736, address: 'Sinquerim, Candolim, Goa' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'],
    user_rating: 4.7,
    description: 'Luxurious 5-star resort overlooking the Arabian Sea, set within the historic Fort Aguada. Features private beach, world-class spa, and multiple dining options.'
  },
  {
    id: 'hotel-goa-002',
    name: 'The Park Calangute',
    destination: 'Goa',
    experiential_tags: ['premium', 'social', 'nightlife', 'beach', 'group-friendly'],
    star_rating: 4,
    price_per_night: 8000,
    amenities: ['Pool', 'Restaurant', 'Bar', 'WiFi', 'Gym', 'Events Space'],
    location: { lat: 15.5430, lng: 73.7551, address: 'Calangute Beach Road, Goa' },
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'],
    user_rating: 4.3,
    description: 'Contemporary boutique hotel with vibrant nightlife, rooftop pool, and easy access to Calangute Beach. Known for its parties and modern design.'
  },
  {
    id: 'hotel-goa-003',
    name: 'Zostel Goa (Anjuna)',
    destination: 'Goa',
    experiential_tags: ['budget-friendly', 'social', 'solo-friendly', 'group-friendly', 'adventurous'],
    star_rating: 2,
    price_per_night: 800,
    amenities: ['Common Area', 'WiFi', 'Kitchen', 'Lockers', 'Activities'],
    location: { lat: 15.5834, lng: 73.7413, address: 'Anjuna Beach Road, North Goa' },
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'Award-winning backpacker hostel near Anjuna Beach. Perfect for solo travelers and groups looking for budget-friendly stays with a social atmosphere.'
  },
  {
    id: 'hotel-goa-004',
    name: 'Palolem Beach Resort',
    destination: 'Goa',
    experiential_tags: ['peaceful', 'beach', 'secluded', 'couple-friendly', 'nature', 'romantic'],
    star_rating: 3,
    price_per_night: 4500,
    amenities: ['Beachfront', 'Restaurant', 'WiFi', 'Balcony', 'Room Service'],
    location: { lat: 15.0100, lng: 74.0230, address: 'Palolem Beach, South Goa' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'],
    user_rating: 4.5,
    description: 'Charming beachfront cottages on the pristine Palolem Beach. Wake up to waves, enjoy seafood dinners, and experience South Goa\'s tranquil side.'
  },
  {
    id: 'hotel-goa-005',
    name: 'Alila Diwa Goa',
    destination: 'Goa',
    experiential_tags: ['luxurious', 'wellness', 'romantic', 'peaceful', 'premium', 'spa'],
    star_rating: 5,
    price_per_night: 12000,
    amenities: ['Infinity Pool', 'Spa', 'Yoga', 'Restaurant', 'Bar', 'Gym', 'Gardens'],
    location: { lat: 15.2832, lng: 73.9862, address: 'Majorda, South Goa' },
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop'],
    user_rating: 4.8,
    description: 'Stunning resort set amid paddy fields with traditional Goan architecture. Award-winning spa, farm-to-table dining, and serene countryside location.'
  },
  {
    id: 'hotel-goa-006',
    name: 'Casa Vagator',
    destination: 'Goa',
    experiential_tags: ['mid-range', 'beach', 'couple-friendly', 'nightlife', 'social'],
    star_rating: 3,
    price_per_night: 5500,
    amenities: ['Pool', 'Restaurant', 'Bar', 'WiFi', 'Parking'],
    location: { lat: 15.6027, lng: 73.7358, address: 'Vagator, North Goa' },
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop'],
    user_rating: 4.2,
    description: 'Stylish boutique hotel in the heart of Vagator, walking distance to beaches and nightlife. Modern rooms with a touch of Goan charm.'
  },
  {
    id: 'hotel-goa-007',
    name: 'Treehouse Blue',
    destination: 'Goa',
    experiential_tags: ['unique', 'nature', 'romantic', 'secluded', 'adventurous', 'photography'],
    star_rating: 4,
    price_per_night: 7000,
    amenities: ['Treehouse', 'Pool', 'Restaurant', 'WiFi', 'Nature Trails'],
    location: { lat: 15.5557, lng: 73.7537, address: 'Arpora, North Goa' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'],
    user_rating: 4.6,
    description: 'Unique treehouse-style accommodations surrounded by lush greenery. A romantic and Instagram-worthy experience unlike typical hotels.'
  },
  {
    id: 'hotel-goa-008',
    name: 'Old Quarter by Jehan Numa',
    destination: 'Goa',
    experiential_tags: ['heritage', 'cultural', 'romantic', 'peaceful', 'premium', 'authentic'],
    star_rating: 4,
    price_per_night: 9000,
    amenities: ['Pool', 'Restaurant', 'Bar', 'Heritage Tours', 'WiFi', 'Library'],
    location: { lat: 15.4957, lng: 73.8295, address: 'Fontainhas, Panjim, Goa' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'],
    user_rating: 4.7,
    description: 'Boutique heritage hotel in the heart of Fontainhas Latin Quarter. Restored Portuguese mansion with colonial-era charm and modern comforts.'
  },

  // ============================================
  // MANALI HOTELS (5 entries)
  // ============================================
  {
    id: 'hotel-manali-001',
    name: 'The Himalayan',
    destination: 'Manali',
    experiential_tags: ['luxurious', 'mountain', 'premium', 'romantic', 'peaceful', 'nature'],
    star_rating: 5,
    price_per_night: 18000,
    amenities: ['Spa', 'Restaurant', 'Bar', 'Mountain Views', 'Fireplace', 'Heated Pool'],
    location: { lat: 32.2432, lng: 77.1688, address: 'Log Huts Area, Manali' },
    images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&auto=format&fit=crop'],
    user_rating: 4.8,
    description: 'Ultra-luxury resort with stunning Himalayan views, world-class spa, and gourmet dining. Each room features panoramic mountain vistas.'
  },
  {
    id: 'hotel-manali-002',
    name: 'Johnson Lodge',
    destination: 'Manali',
    experiential_tags: ['heritage', 'peaceful', 'family-friendly', 'nature', 'authentic', 'cozy'],
    star_rating: 3,
    price_per_night: 4000,
    amenities: ['Garden', 'Restaurant', 'WiFi', 'Fireplace', 'Mountain Views', 'Parking'],
    location: { lat: 32.2396, lng: 77.1887, address: 'Circuit House Road, Manali' },
    images: ['https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&auto=format&fit=crop'],
    user_rating: 4.5,
    description: 'Classic colonial-era lodge with old-world charm. Cozy rooms with fireplaces, apple orchard views, and legendary hospitality since 1930s.'
  },
  {
    id: 'hotel-manali-003',
    name: 'Zostel Manali',
    destination: 'Manali',
    experiential_tags: ['budget-friendly', 'social', 'solo-friendly', 'adventurous', 'group-friendly'],
    star_rating: 2,
    price_per_night: 600,
    amenities: ['Common Area', 'Café', 'WiFi', 'Mountain Views', 'Activities', 'Bonfire'],
    location: { lat: 32.2615, lng: 77.1842, address: 'Old Manali, Manali' },
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'Popular backpacker hostel in Old Manali with stunning river views. Great for meeting fellow travelers, bonfire nights, and adventure activities.'
  },
  {
    id: 'hotel-manali-004',
    name: 'Solang Valley Resort',
    destination: 'Manali',
    experiential_tags: ['adventurous', 'mountain', 'family-friendly', 'nature', 'mid-range'],
    star_rating: 4,
    price_per_night: 6500,
    amenities: ['Restaurant', 'Adventure Desk', 'WiFi', 'Parking', 'Mountain Views'],
    location: { lat: 32.3159, lng: 77.1546, address: 'Solang Valley Road, Manali' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'],
    user_rating: 4.3,
    description: 'Located near Solang Valley adventure zone. Perfect base for skiing, paragliding, and other adventure activities with comfortable rooms.'
  },
  {
    id: 'hotel-manali-005',
    name: 'Manu Allaya Spa Resort',
    destination: 'Manali',
    experiential_tags: ['wellness', 'luxurious', 'peaceful', 'spa', 'romantic', 'healing'],
    star_rating: 5,
    price_per_night: 14000,
    amenities: ['Spa', 'Yoga', 'Pool', 'Restaurant', 'Meditation', 'Ayurveda'],
    location: { lat: 32.2578, lng: 77.1753, address: 'Sunny Side, Chadiyari, Manali' },
    images: ['https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&auto=format&fit=crop'],
    user_rating: 4.7,
    description: 'Wellness-focused luxury resort offering Ayurvedic treatments, yoga retreats, and spa therapies amidst pine forests and mountain views.'
  },

  // ============================================
  // PUNE HOTELS (4 entries)
  // ============================================
  {
    id: 'hotel-pune-001',
    name: 'JW Marriott Pune',
    destination: 'Pune',
    experiential_tags: ['luxurious', 'premium', 'urban', 'couple-friendly', 'spa'],
    star_rating: 5,
    price_per_night: 12000,
    amenities: ['Spa', 'Pool', 'Multiple Restaurants', 'Bar', 'Gym', 'Business Center'],
    location: { lat: 18.5308, lng: 73.9073, address: 'Senapati Bapat Road, Pune' },
    images: ['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop'],
    user_rating: 4.6,
    description: 'Premier 5-star luxury in Pune\'s business district. Award-winning restaurants, rooftop pool, and impeccable service.'
  },
  {
    id: 'hotel-pune-002',
    name: 'O Hotel',
    destination: 'Pune',
    experiential_tags: ['mid-range', 'urban', 'social', 'nightlife', 'group-friendly'],
    star_rating: 4,
    price_per_night: 6000,
    amenities: ['Rooftop Bar', 'Restaurant', 'WiFi', 'Gym', 'Events Space'],
    location: { lat: 18.5362, lng: 73.8939, address: 'North Main Road, Koregaon Park, Pune' },
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&auto=format&fit=crop'],
    user_rating: 4.3,
    description: 'Hip boutique hotel in trendy Koregaon Park. Famous rooftop bar, walking distance to cafés and nightlife.'
  },
  {
    id: 'hotel-pune-003',
    name: 'Osho Guesthouse',
    destination: 'Pune',
    experiential_tags: ['spiritual', 'peaceful', 'wellness', 'meditation', 'solo-friendly', 'healing'],
    star_rating: 3,
    price_per_night: 3500,
    amenities: ['Meditation Hall', 'Garden', 'Vegetarian Restaurant', 'WiFi', 'Library'],
    location: { lat: 18.5370, lng: 73.8959, address: 'Koregaon Park, Pune' },
    images: ['https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&auto=format&fit=crop'],
    user_rating: 4.4,
    description: 'Tranquil accommodation within the Osho Meditation Resort. For seekers and those looking for peaceful, mindful stays.'
  },
  {
    id: 'hotel-pune-004',
    name: 'Backpacker Panda',
    destination: 'Pune',
    experiential_tags: ['budget-friendly', 'social', 'solo-friendly', 'urban', 'group-friendly'],
    star_rating: 2,
    price_per_night: 700,
    amenities: ['Common Area', 'WiFi', 'Kitchen', 'Lockers', 'City Tours'],
    location: { lat: 18.5362, lng: 73.8939, address: 'Koregaon Park, Pune' },
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&auto=format&fit=crop'],
    user_rating: 4.2,
    description: 'Modern hostel for budget travelers. Clean dorms, great common areas, and organized city tours and pub crawls.'
  }
];

// Template for adding new hotels
export const HOTEL_TEMPLATE: Hotel = {
  id: 'hotel-destination-XXX',
  name: 'Hotel Name',
  destination: 'Destination', // Goa, Manali, or Pune
  experiential_tags: [], // Add 5-8 tags
  star_rating: 3, // 1-5
  price_per_night: 5000,
  amenities: ['Pool', 'WiFi', 'Restaurant'],
  location: { lat: 0, lng: 0, address: 'Full address' },
  images: ['https://images.unsplash.com/photo-xxx'],
  user_rating: 4.0,
  description: 'Brief description of the hotel (1-2 sentences).'
};
