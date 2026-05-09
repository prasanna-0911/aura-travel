# Aura Travel

> AI-Powered Travel Planning Platform — Built with MERN Stack

![Aura Travel](https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop)

## 🔗 Live Demo

- **Frontend:** https://aura-travel-blond.vercel.app
- **Backend API:** https://aura-travel-1.onrender.com/api

---

## 🎯 Features

### AI Experience Weaver
Describe your dream trip in natural language — "peaceful beach trip with cultural experiences for 3 days" — and our AI generates a complete day-by-day itinerary with activities, hotels, and restaurants.

### AI Travel Sync
Real-time trip adaptation. When conditions change (weather, crowds, energy levels), the system proactively suggests alternatives that match your original preferences.

### Curated Travel Catalog
115+ hand-picked experiences across **Goa**, **Manali**, and **Pune** — each tagged with experiential descriptors for intelligent matching.

### Interactive Maps
Route visualization with real road distances and travel times between stops, powered by OpenStreetMap.

### Mock Booking Flow
Search and "book" flights and hotels with a complete flow — from search results to payment to confirmation.

### Admin Dashboard
Manage the catalog with full CRUD operations, analytics, and user management.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19 + Vite + Tailwind CSS v4 |
| **Backend** | Express.js + Node.js |
| **Database** | MongoDB Atlas (M0 Free Tier) |
| **NLP** | compromise.js |
| **Maps** | React-Leaflet + OpenStreetMap |
| **Routing API** | OSRM (Open Source Routing Machine) |
| **Auth** | JWT + bcrypt |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## 📁 Project Structure

```
aura-travel/
├── src/                          # React frontend
│   ├── components/
│   │   ├── layout/              # Navbar, Footer, Layout
│   │   ├── maps/                # ItineraryMap, DestinationMap, TripOverviewMap
│   │   ├── weaver/              # ItineraryResults
│   │   └── notifications/       # Toast notifications
│   ├── pages/                   # Route pages
│   │   ├── Home.tsx
│   │   ├── Weaver.tsx           # AI Experience Weaver
│   │   ├── LiveTrip.tsx         # AI Travel Sync
│   │   ├── Explore.tsx          # Catalog browse
│   │   ├── Bookings.tsx         # Flight + hotel booking
│   │   ├── Admin.tsx            # Admin dashboard
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── Profile.tsx
│   ├── services/                # API clients
│   ├── hooks/                   # Custom hooks
│   ├── context/                 # Auth context
│   ├── data/                    # Local catalog data
│   ├── utils/                   # NLP utilities, helpers
│   └── types/                   # TypeScript declarations
│
├── backend/                      # Express API
│   ├── src/
│   │   ├── config/db.js         # MongoDB connection
│   │   ├── models/              # Mongoose schemas
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   ├── middleware/          # Auth, validation, errors
│   │   ├── utils/               # Helpers, NLP service
│   │   └── server.js            # Entry point
│   ├── scripts/
│   │   └── seed.js              # Database seeder
│   └── data/
│       └── expansionData.js     # Additional catalog data
│
├── docs/                         # Documentation
├── technical_architecture.md     # System design
├── master_roadmap.md            # 16-week development plan
└── implementation_guides.md      # Feature implementation guides
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites

- Node.js 18 or newer
- MongoDB Atlas cluster (free M0 tier) or local MongoDB

### Step 1: Clone the Repository

```bash
git clone https://github.com/prasanna-0911/aura-travel.git
cd aura-travel
```

### Step 2: Install Dependencies

**Frontend:**
```bash
npm install
```

**Backend:**
```bash
npm --prefix backend install
```

### Step 3: Setup Environment

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` with your values:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/auratravel
JWT_SECRET=your-secret-key-change-this
FRONTEND_URL=http://localhost:5173
```

### Step 4: Seed the Database

```bash
npm --prefix backend run seed
```

Expected output:
```
Aura Travel seed complete
Activities: 76
Hotels: 21
Restaurants: 18
Catalog entities: 115
```

### Step 5: Run Development Servers

**Terminal 1 — Backend:**
```bash
npm --prefix backend run dev
```

**Terminal 2 — Frontend:**
```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api/health

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@auratravel.local` | `Admin@12345` |
| User | `user@auratravel.local` | `User@12345` |

---

## 🌐 Production Deployment

### Backend — Render

1. Go to https://render.com → New → Web Service
2. Connect your GitHub repository
3. Configure:
   - **Root Directory:** `backend`
   - **Build Command:** `npm install`
   - **Start Command:** `node src/server.js`
   - **Node Version:** `18`
4. Add Environment Variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a strong random string
   - `JWT_EXPIRE` — `24h`
   - `FRONTEND_URL` — your Vercel frontend URL
   - `NODE_ENV` — `production`
5. Deploy — you'll get a URL like `https://aura-travel.onrender.com`

### Frontend — Vercel

1. Go to https://vercel.com → New Project
2. Import your GitHub repository
3. Configure:
   - **Root Directory:** `.`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add Environment Variable:
   - `VITE_API_URL` — your Render backend URL (e.g., `https://aura-travel.onrender.com/api`)
5. Deploy

### ⚠️ Service Limitations (Free Tier)

**Render:**
- Services sleep after 15 minutes of inactivity
- To wake up: visit https://dashboard.render.com and click your service
- Monthly free hours: 750 (enough for ~24/7 uptime with 1 service)

**Vercel:**
- 100GB bandwidth/month
- 100 deployments/day
- Frontend usually stays awake

**MongoDB Atlas M0:**
- Free forever — no time limits
- 512MB storage limit

---

## 📡 API Endpoints

Base URL: `https://aura-travel-1.onrender.com/api`

### Health Check
```
GET /api/health
```

### Authentication
```
POST /api/auth/register    # Create new account
POST /api/auth/login       # Login
GET  /api/auth/profile     # Get current user (requires token)
```

### AI Experience Weaver
```
POST /api/weaver/generate  # Generate itinerary from natural language
GET  /api/weaver/destinations  # Get available destinations
GET  /api/weaver/tags       # Get all experiential tags
```

### Catalog
```
GET /api/activities        # List activities (filter by destination)
GET /api/hotels             # List hotels
GET /api/restaurants        # List restaurants
```

### Trips & Sync
```
POST /api/trips/start       # Start a live trip
GET  /api/trips/current    # Get current active trip
POST /api/sync/check-conflicts  # Check for conflicts
POST /api/sync/accept-suggestion # Accept alternative suggestion
```

### Bookings
```
POST /api/bookings/save     # Save booking
GET  /api/bookings          # Get user's bookings
```

### Admin (requires admin token)
```
GET    /api/admin/activities  # List all activities
POST   /api/admin/activities   # Create activity
PUT    /api/admin/activities/:id  # Update activity
DELETE /api/admin/activities/:id  # Delete activity
GET    /api/admin/analytics   # Get analytics
```

---

## 🤖 AI Features Explained

### NLP Tag Extraction
Uses `compromise.js` to parse natural language queries into experiential tags:
- Emotional: peaceful, adventurous, romantic, cultural
- Environment: beach, mountain, outdoors, indoors
- Budget: budget-friendly, premium, mid-range
- Activity: hiking, food, nightlife, wellness

### Itinerary Generation
1. Extract tags and destination from query
2. Score activities by tag overlap, rating, and cost
3. Select top activities for each time slot (morning/afternoon/evening)
4. Select best-matching hotel
5. Recommend nearby restaurants

### Travel Sync
Detects conflicts based on:
- Weather changes (rain → indoor alternatives)
- Overcrowding (popular spots → hidden gems)
- User energy (adventure → relaxation)
- Venue closures (direct replacements)

---

## 📊 Database Schema

### Activities Collection
```json
{
  "id": "act_goa_baga_beach",
  "name": "Baga Beach",
  "destination": "Goa",
  "category": "leisure",
  "description": "Popular beach known for...",
  "experiential_tags": ["beach", "outdoors", "relaxing", "social"],
  "duration_hours": 3,
  "cost_inr": 200,
  "location": { "lat": 15.5557, "lng": 73.7537, "address": "Baga, Goa" },
  "user_rating": 4.5,
  "best_time": "morning",
  "images": ["https://..."]
}
```

### Hotels Collection
```json
{
  "id": "hotel_goa_leela",
  "name": "The Leela Goa",
  "destination": "Goa",
  "star_rating": 5,
  "price_per_night": 12000,
  "experiential_tags": ["luxury", "beach", "romantic"],
  "amenities": ["pool", "spa", "restaurant", "wifi"],
  "location": { "lat": 15.5019, "lng": 73.7592, "address": "Cavelossim, Goa" }
}
```

### Users Collection
```json
{
  "name": "Demo User",
  "email": "user@auratravel.local",
  "password": "(hashed)",
  "role": "user",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

---

## 🧪 Testing

### Local Testing

1. Start both servers (see Quick Start)
2. Open http://localhost:5173
3. Register a new account or login
4. Try the Experience Weaver with "peaceful mountains for 3 days"
5. Start a Live Trip and simulate scenarios (rain, overcrowding)
6. Explore the catalog and book a flight + hotel

### Smoke Test
```bash
npm --prefix backend run smoke
```

### API Health
```bash
curl https://aura-travel-1.onrender.com/api/health
```

---

## 🔧 Troubleshooting

### "MongoDB connection failed"
- Check your `MONGODB_URI` in `.env` or Render environment variables
- Ensure your IP is whitelisted in MongoDB Atlas → Security → Network Access

### "Route not found: /"
- The backend is running instead of the frontend
- Check your Vercel root directory is `.` not `backend`

### Services went to sleep (Render)
- Visit https://dashboard.render.com and click your service
- Wait 30-60 seconds for it to wake up
- First request after sleep may timeout — retry

### Vercel build failed
- Check the deployment logs for TypeScript errors
- Ensure `vercel.json` is in the root directory
- Check environment variable `VITE_API_URL` is set

### Database not seeded
- Run `npm --prefix backend run seed`
- Ensure MongoDB Atlas cluster is active (not paused)

---

## 📄 License

This project was built as a university/college project. All rights reserved.

---

## 👤 Author

Prasanna Kumar — https://github.com/prasanna-0911

## 🙏 Acknowledgments

Built with guidance from the Master Production Roadmap and Technical Architecture documentation in this repository.