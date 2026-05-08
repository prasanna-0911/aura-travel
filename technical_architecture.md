# AURA TRAVEL - Technical Architecture
## Complete System Design & Technology Stack

---

## 🏗️ **SYSTEM ARCHITECTURE OVERVIEW**

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT LAYER                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React.js Frontend (SPA)                              │  │
│  │  - React Router (Navigation)                          │  │
│  │  - Material-UI / Tailwind (Styling)                   │  │
│  │  - Axios (HTTP Client)                                │  │
│  │  - React-Leaflet (Maps)                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ HTTPS
┌─────────────────────────────────────────────────────────────┐
│                   APPLICATION LAYER                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express.js Backend (REST API)             │  │
│  │  ┌─────────────┐  ┌──────────────┐  ┌────────────┐  │  │
│  │  │   Auth      │  │   Weaver     │  │    Sync    │  │  │
│  │  │  Service    │  │   Service    │  │  Service   │  │  │
│  │  └─────────────┘  └──────────────┘  └────────────┘  │  │
│  │  ┌─────────────┐  ┌──────────────┐                  │  │
│  │  │   Booking   │  │     NLP      │                  │  │
│  │  │  Service    │  │   Engine     │                  │  │
│  │  └─────────────┘  └──────────────┘                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                           ↕ MongoDB Protocol
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  MongoDB Atlas (Cloud Database)                       │  │
│  │  - Users Collection                                   │  │
│  │  - Activities Collection                              │  │
│  │  - Hotels Collection                                  │  │
│  │  - Restaurants Collection                             │  │
│  │  - Trips Collection (Live trips)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 💻 **TECHNOLOGY STACK**

### **Frontend Stack**

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **React.js** | 18.2+ | UI Framework | Component-based, fast, huge ecosystem |
| **React Router** | 6.x | Client-side routing | SPA navigation, protected routes |
| **Material-UI** | 5.x | Component library | Professional UI components, responsive |
| **Axios** | 1.x | HTTP client | Promise-based, interceptors, clean API |
| **React-Leaflet** | 4.x | Maps integration | FREE, OpenStreetMap, full-featured |
| **compromise.js** | 14.x | NLP parsing | Lightweight, fast, no external calls |
| **date-fns** | 2.x | Date manipulation | Lightweight alternative to Moment.js |
| **React Hook Form** | 7.x | Form handling | Performance, validation, easy integration |

**Build Tools:**
- **Vite** or **Create React App** (CRA) - Fast dev server
- **ESLint** - Code linting
- **Prettier** - Code formatting

---

### **Backend Stack**

| Technology | Version | Purpose | Why Chosen |
|------------|---------|---------|------------|
| **Node.js** | 18 LTS | Runtime | JavaScript full-stack, async I/O |
| **Express.js** | 4.x | Web framework | Minimal, flexible, middleware support |
| **MongoDB** | 6.x | Database | NoSQL, flexible schema, tag arrays |
| **Mongoose** | 7.x | ODM | Schema validation, middleware, queries |
| **bcrypt** | 5.x | Password hashing | Industry standard, secure |
| **jsonwebtoken** | 9.x | JWT auth | Stateless authentication |
| **cors** | 2.x | CORS handling | Frontend-backend communication |
| **dotenv** | 16.x | Environment vars | Configuration management |
| **express-validator** | 7.x | Input validation | Security, data integrity |
| **morgan** | 1.x | HTTP logging | Debugging, monitoring |

**Optional (If time permits):**
- **Redis** - Caching layer
- **Socket.io** - Real-time features

---

### **Database: MongoDB**

**Why MongoDB?**
✅ Flexible schema (activities have varying attributes)  
✅ Native array support (experiential_tags: [])  
✅ Powerful query operators ($all, $in)  
✅ Horizontal scaling (sharding)  
✅ Free tier (512MB) sufficient for prototype  
✅ Atlas cloud hosting (no server management)  

---

### **Maps: Leaflet.js + OpenStreetMap**

**Why Leaflet over Google Maps?**
✅ **100% FREE** (no API limits)  
✅ Open-source, community-driven  
✅ Lightweight (39KB gzipped)  
✅ Fully customizable  
✅ Works offline (cache tiles)  
✅ Plugins ecosystem (routing, clustering)  

**Features:**
- Interactive maps
- Custom markers with popups
- Route drawing (Leaflet Routing Machine)
- Geocoding (Nominatim - free)
- Clustering (many markers)

---

### **NLP: compromise.js**

**Why compromise.js?**
✅ Client-side compatible (runs in browser)  
✅ Fast (no API calls, no latency)  
✅ Lightweight (200KB)  
✅ Good for tag extraction  
✅ Interpretable (rule-based)  
✅ Free (no API costs)  

**Capabilities:**
- Part-of-speech tagging
- Entity recognition
- Sentence parsing
- Custom tag dictionaries

---

## 📁 **PROJECT FOLDER STRUCTURE**

```
aura-travel/
├── frontend/                    # React application
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   └── images/             # Static images
│   ├── src/
│   │   ├── components/         # Reusable components
│   │   │   ├── common/         # Shared (Button, Card, etc.)
│   │   │   ├── layout/         # Header, Footer, Sidebar
│   │   │   ├── auth/           # Login, Register
│   │   │   ├── weaver/         # AI Experience Weaver UI
│   │   │   ├── sync/           # AI Travel Sync UI
│   │   │   ├── maps/           # Leaflet map components
│   │   │   └── booking/        # Booking flow components
│   │   ├── pages/              # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Search.jsx
│   │   │   ├── Itinerary.jsx
│   │   │   ├── LiveTrip.jsx
│   │   │   ├── Booking.jsx
│   │   │   └── Profile.jsx
│   │   ├── services/           # API calls
│   │   │   ├── api.js          # Axios instance
│   │   │   ├── authService.js
│   │   │   ├── weaverService.js
│   │   │   └── syncService.js
│   │   ├── utils/              # Helper functions
│   │   │   ├── nlp.js          # compromise.js wrapper
│   │   │   ├── validators.js
│   │   │   └── formatters.js
│   │   ├── context/            # React Context
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/              # Custom hooks
│   │   │   └── useAuth.js
│   │   ├── App.jsx             # Main app component
│   │   ├── routes.jsx          # Route definitions
│   │   └── index.js            # Entry point
│   ├── package.json
│   └── vite.config.js / craco.config.js
│
├── backend/                     # Express application
│   ├── src/
│   │   ├── config/             # Configuration
│   │   │   ├── db.js           # MongoDB connection
│   │   │   └── env.js          # Environment variables
│   │   ├── models/             # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Activity.js
│   │   │   ├── Hotel.js
│   │   │   ├── Restaurant.js
│   │   │   └── Trip.js
│   │   ├── routes/             # API routes
│   │   │   ├── auth.js
│   │   │   ├── weaver.js
│   │   │   ├── sync.js
│   │   │   ├── booking.js
│   │   │   └── admin.js
│   │   ├── controllers/        # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── weaverController.js
│   │   │   ├── syncController.js
│   │   │   └── bookingController.js
│   │   ├── services/           # Business logic
│   │   │   ├── nlpService.js   # compromise.js logic
│   │   │   ├── matchingService.js  # Tag matching
│   │   │   ├── composerService.js  # Itinerary assembly
│   │   │   └── syncEngine.js   # Replanning logic
│   │   ├── middleware/         # Express middleware
│   │   │   ├── auth.js         # JWT verification
│   │   │   ├── errorHandler.js
│   │   │   └── validation.js
│   │   ├── utils/              # Utilities
│   │   │   ├── tagDictionary.js  # 95 tags
│   │   │   └── scoring.js      # Ranking functions
│   │   └── server.js           # Entry point
│   ├── data/                   # Mock data
│   │   ├── flights.json
│   │   └── hotels.json
│   ├── package.json
│   └── .env.example            # Environment template
│
├── database/                    # Database scripts
│   ├── seeds/                  # Sample data
│   │   ├── activities.json
│   │   └── seedData.js
│   └── schemas/                # Schema documentation
│
├── docs/                       # Documentation
│   ├── API.md                  # API documentation
│   ├── SETUP.md                # Setup instructions
│   └── USER_MANUAL.md          # User guide
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## 🗄️ **DATABASE SCHEMA DESIGN**

### **1. Users Collection**

```javascript
{
  _id: ObjectId,
  name: String,                    // "Prasanna Kumar"
  email: String,                   // "prasanna@example.com" (unique, indexed)
  password: String,                // Hashed with bcrypt
  role: String,                    // "user" | "admin"
  createdAt: Date,
  preferences: {                   // Optional: user preferences
    favoriteDestinations: [String],
    experientialPreferences: [String]  // Preferred tags
  }
}
```

**Indexes:**
- `email` (unique)
- `createdAt` (for analytics)

---

### **2. Activities Collection**

```javascript
{
  _id: ObjectId,
  name: String,                    // "Baga Beach Sunbathing"
  destination: String,             // "Goa" (indexed)
  category: String,                // "leisure" | "cultural" | "adventure"
  description: String,             // Full description
  experiential_tags: [String],     // ["outdoors", "relaxing", "beach", "budget_friendly"]
  
  // Practical details
  duration_hours: Number,          // 2.5
  cost_inr: Number,                // 500
  opening_hours: {
    weekday: String,               // "24/7" or "09:00-18:00"
    weekend: String
  },
  
  // Location
  location: {
    lat: Number,                   // 15.5557
    lng: Number,                   // 73.7537
    address: String
  },
  
  // Media
  images: [String],                // URLs to images
  
  // Metadata
  user_rating: Number,             // 4.5 (out of 5)
  accessibility: String,           // "wheelchair_accessible" | "stairs" | "none"
  best_time: String,               // "morning" | "afternoon" | "evening" | "anytime"
  
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `destination` (for filtering)
- `experiential_tags` (for tag matching)
- `category` (for browsing)

---

### **3. Hotels Collection**

```javascript
{
  _id: ObjectId,
  name: String,                    // "Sea View Resort"
  destination: String,             // "Goa"
  experiential_tags: [String],     // ["luxurious", "beach", "romantic", "premium"]
  
  // Hotel details
  star_rating: Number,             // 4 (stars)
  price_per_night: Number,         // 3500
  amenities: [String],             // ["pool", "spa", "restaurant", "wifi"]
  
  // Location
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  
  images: [String],
  user_rating: Number,
  
  createdAt: Date
}
```

---

### **4. Restaurants Collection**

```javascript
{
  _id: ObjectId,
  name: String,                    // "Fisherman's Wharf"
  destination: String,             // "Goa"
  cuisine: [String],               // ["Seafood", "Goan", "Continental"]
  experiential_tags: [String],     // ["romantic", "cultural", "premium", "indoors"]
  
  price_range: String,             // "₹₹₹" (budget indicator)
  avg_cost_per_person: Number,     // 1200
  
  location: {
    lat: Number,
    lng: Number,
    address: String
  },
  
  images: [String],
  user_rating: Number,
  
  createdAt: Date
}
```

---

### **5. Trips Collection (Active/Live Trips)**

```javascript
{
  _id: ObjectId,
  user_id: ObjectId,               // Reference to User
  destination: String,             // "Goa"
  start_date: Date,
  end_date: Date,
  status: String,                  // "planned" | "active" | "completed"
  
  // Generated itinerary
  itinerary: {
    day_1: {
      date: Date,
      activities: [
        {
          activity_id: ObjectId,   // Reference to Activity
          time_slot: String,       // "morning" | "afternoon" | "evening"
          status: String,          // "pending" | "completed" | "skipped"
          scheduled_time: String   // "09:00 AM"
        }
      ],
      hotel_id: ObjectId,          // Reference to Hotel
      restaurants: [ObjectId]
    },
    day_2: { ... },
    day_3: { ... }
  },
  
  // For AI Travel Sync
  current_day: Number,             // 1 (which day of trip)
  current_activity_index: Number,  // 0 (which activity in day)
  
  // History
  suggestions_received: [
    {
      timestamp: Date,
      context: String,             // "weather_rain"
      original_activity: ObjectId,
      suggested_activity: ObjectId,
      user_action: String          // "accepted" | "declined"
    }
  ],
  
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🔌 **API ENDPOINTS SPECIFICATION**

### **Authentication Endpoints**

```
POST   /api/auth/register
Body:  { name, email, password }
Response: { success, message, user, token }

POST   /api/auth/login
Body:  { email, password }
Response: { success, user, token }

GET    /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Response: { success, user }

PUT    /api/auth/profile
Headers: { Authorization: "Bearer <token>" }
Body:  { name, preferences }
Response: { success, user }
```

---

### **AI Experience Weaver Endpoints**

```
POST   /api/weaver/generate
Body:  { 
  query: "I want a peaceful beach trip for 3 days",
  duration: 3,
  budget: "medium"  // Optional
}
Response: {
  success: true,
  extracted_tags: ["peaceful", "beach"],
  destination: "Goa",
  itinerary: {
    day_1: { activities: [...], hotel: {...}, restaurants: [...] },
    day_2: { ... },
    day_3: { ... }
  },
  total_cost: 15000,
  generation_time: 3.2  // seconds
}

GET    /api/weaver/destinations
Response: { success, destinations: ["Goa", "Manali", "Pune"] }

GET    /api/weaver/tags
Response: { success, tags: { tier1: [...], tier2: [...] } }
```

---

### **AI Travel Sync Endpoints**

```
POST   /api/trips/start
Headers: { Authorization: "Bearer <token>" }
Body:  { itinerary_id, start_date }
Response: { success, trip_id }

GET    /api/trips/current
Headers: { Authorization: "Bearer <token>" }
Response: { success, trip: {...} }

POST   /api/sync/check-conflicts
Body:  {
  trip_id: ObjectId,
  context_change: {
    type: "weather",    // "weather" | "overcrowding" | "user_preference"
    value: "rain"       // "rain" | "sunny" | "high" | etc.
  }
}
Response: {
  conflict: true,
  next_activity: {...},
  suggestions: [
    {
      activity: {...},
      reasoning: "It's raining! This indoor museum matches your cultural interest.",
      relevance_score: 0.92
    }
  ]
}

POST   /api/sync/accept-suggestion
Body:  { trip_id, activity_id }
Response: { success, updated_trip: {...} }
```

---

### **Booking Endpoints (Mock)**

```
GET    /api/flights?origin=Pune&destination=Goa&date=2025-03-15
Response: { success, flights: [...] }

GET    /api/hotels?destination=Goa&checkin=2025-03-15&checkout=2025-03-18
Response: { success, hotels: [...] }

POST   /api/bookings/confirm (Mock - no real payment)
Body:  { flight_id, hotel_id, trip_id }
Response: { success, booking_confirmation: {...} }
```

---

### **Admin Endpoints**

```
GET    /api/admin/activities
Headers: { Authorization: "Bearer <admin-token>" }
Response: { success, activities: [...], total: 110 }

POST   /api/admin/activities
Body:  { name, destination, tags, ... }
Response: { success, activity: {...} }

PUT    /api/admin/activities/:id
Body:  { updated fields }
Response: { success, activity: {...} }

DELETE /api/admin/activities/:id
Response: { success, message }

GET    /api/admin/analytics
Response: { 
  total_users, 
  total_trips, 
  popular_destinations,
  tag_usage_stats 
}
```

---

## 🔐 **SECURITY CONSIDERATIONS**

### **Authentication Flow**

1. **Registration:**
   - Validate email format
   - Hash password with bcrypt (10 rounds)
   - Store hashed password (NEVER plaintext)
   - Generate JWT token (24h expiry)

2. **Login:**
   - Find user by email
   - Compare password with bcrypt.compare()
   - Generate new JWT token
   - Return token + user data (without password)

3. **Protected Routes:**
   - Frontend: Check token in localStorage, redirect if missing
   - Backend: Verify JWT in middleware, attach user to req.user

### **JWT Structure**

```javascript
{
  payload: {
    userId: "abc123",
    email: "user@example.com",
    role: "user",
    iat: 1234567890,  // Issued at
    exp: 1234654290   // Expires (24h later)
  },
  signature: "..." // Signed with SECRET_KEY
}
```

### **Environment Variables (.env)**

```bash
# Backend .env file
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/auratravel

# JWT
JWT_SECRET=your-super-secret-key-change-this-in-production
JWT_EXPIRE=24h

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Optional: API Keys (if using external services)
GEMINI_API_KEY=your-key-here (if upgrading NLP)
```

---

## 🚀 **DEPLOYMENT ARCHITECTURE**

### **Production Deployment Plan**

```
Frontend (React):     Vercel    → https://auratravel.vercel.app
Backend (Express):    Render    → https://auratravel-api.onrender.com
Database (MongoDB):   Atlas     → Cloud (M0 Free Tier)
Domain:               Namecheap → https://auratravel.com (₹500)
```

### **Vercel Deployment (Frontend)**

1. Connect GitHub repo
2. Auto-detect React
3. Set environment variable: `VITE_API_URL=https://auratravel-api.onrender.com`
4. Deploy

**Free tier:** Unlimited bandwidth, auto-scaling

### **Render Deployment (Backend)**

1. Connect GitHub repo
2. Set build command: `npm install`
3. Set start command: `node src/server.js`
4. Add environment variables (MONGODB_URI, JWT_SECRET, etc.)
5. Deploy

**Free tier:** 750 hours/month (sufficient)

### **MongoDB Atlas (Database)**

1. Create cluster (M0 Free Tier - 512MB)
2. Whitelist IP: `0.0.0.0/0` (allow from anywhere)
3. Create database user
4. Get connection string
5. Add to backend .env

**Free tier:** 512MB storage, shared RAM

---

## 📊 **PERFORMANCE TARGETS**

| Metric | Target | How to Achieve |
|--------|--------|----------------|
| **Page Load Time** | < 3 seconds | Code splitting, lazy loading, image optimization |
| **API Response** | < 500ms | MongoDB indexing, efficient queries |
| **Itinerary Generation** | < 4.5s | Optimize matching algorithm, limit DB queries |
| **Replanning Suggestion** | < 1.5s | Pre-compute alternatives, cache common queries |
| **Lighthouse Score** | > 90 | Optimize images, minify JS/CSS, HTTPS |
| **Mobile Responsive** | 100% | Mobile-first CSS, touch-friendly UI |

---

## 🧪 **TESTING STRATEGY**

### **Frontend Testing**

```javascript
// Example: React component test
import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders login form', () => {
  render(<Login />);
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});
```

**Tools:** Jest, React Testing Library

### **Backend Testing**

```javascript
// Example: API endpoint test
const request = require('supertest');
const app = require('./server');

test('POST /api/auth/register creates user', async () => {
  const res = await request(app)
    .post('/api/auth/register')
    .send({ name: 'Test', email: 'test@example.com', password: 'pass123' });
  
  expect(res.statusCode).toBe(201);
  expect(res.body.success).toBe(true);
});
```

**Tools:** Jest, Supertest

### **Manual Testing Checklist**

- [ ] User can register and login
- [ ] Protected routes redirect if not logged in
- [ ] AI Experience Weaver generates valid itineraries
- [ ] AI Travel Sync detects conflicts and suggests alternatives
- [ ] Maps display markers and routes correctly
- [ ] Booking flow works end-to-end
- [ ] Admin panel CRUD operations work
- [ ] Mobile responsive on 3+ screen sizes
- [ ] Cross-browser (Chrome, Firefox, Safari)

---

## 📚 **NEXT STEPS**

1. Review this architecture document
2. Set up development environment (see artifact #6)
3. Follow Week 1 roadmap tasks
4. Start coding!

**All technical decisions are made. Time to build!** 💻🚀