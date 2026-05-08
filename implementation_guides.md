# AURA TRAVEL - Implementation Guides
## Complete Feature Implementation, Setup, Data Curation & Testing

---

## 📦 **PART 1: FEATURE IMPLEMENTATION PRIORITY**

### **PRIORITY 1 FEATURES (Must-Have - Weeks 1-13)**

#### **1. User Authentication System (Week 2)**

**Frontend Implementation:**
```javascript
// src/components/auth/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Login</button>
    </form>
  );
}
```

**Backend Implementation:**
```javascript
// backend/src/controllers/authController.js
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = await User.create({ name, email, password: hashedPassword });
    
    // Generate token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.status(201).json({ success: true, user: { id: user._id, name, email }, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ success: true, user: { id: user._id, name: user.name, email }, token });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
```

---

#### **2. NLP Tag Extraction (Week 5)**

```javascript
// backend/src/services/nlpService.js
const nlp = require('compromise');

// 95-tag dictionary
const TAG_DICTIONARY = {
  // Tier 1: Emotional/Experiential
  emotional: ['peaceful', 'quiet', 'relaxing', 'romantic', 'adventurous', 'thrilling', 'cultural', 'spiritual', 'luxurious', 'rustic', 'social', 'serene'],
  
  // Tier 2: Practical
  environment: ['indoors', 'outdoors', 'beach', 'mountain', 'city', 'rural'],
  budget: ['budget_friendly', 'budget', 'cheap', 'affordable', 'premium', 'luxury', 'expensive'],
  social: ['solo_friendly', 'solo', 'family_friendly', 'family', 'couples', 'group'],
  activity: ['adventure', 'culture', 'leisure', 'sports', 'wellness', 'nightlife', 'shopping'],
  accessibility: ['wheelchair_accessible', 'easy_access', 'challenging']
};

exports.extractTags = (query) => {
  const doc = nlp(query.toLowerCase());
  
  const extractedTags = [];
  const extractedLocation = null;
  const extractedDuration = null;
  
  // Extract adjectives and map to tags
  const adjectives = doc.adjectives().out('array');
  adjectives.forEach(adj => {
    Object.values(TAG_DICTIONARY).forEach(category => {
      if (category.includes(adj)) {
        extractedTags.push(adj);
      }
    });
  });
  
  // Extract location entities
  const places = doc.places().out('array');
  const location = places.length > 0 ? places[0] : null;
  
  // Extract duration
  const durationMatch = query.match(/(\d+)\s*(day|days|week|weeks)/i);
  const duration = durationMatch ? parseInt(durationMatch[1]) : 3; // Default 3 days
  
  return {
    tags: [...new Set(extractedTags)], // Remove duplicates
    location,
    duration,
    confidence: extractedTags.length > 0 ? 0.88 : 0.5
  };
};
```

---

#### **3. Itinerary Generation (Week 7)**

```javascript
// backend/src/services/composerService.js
const Activity = require('../models/Activity');
const Hotel = require('../models/Hotel');

exports.composeItinerary = async (tags, location, duration) => {
  // Query activities matching tags
  const activities = await Activity.find({
    destination: location,
    experiential_tags: { $all: tags }
  }).limit(duration * 4); // 4 activities per day max
  
  // Score and rank activities
  const scoredActivities = activities.map(act => ({
    ...act.toObject(),
    score: calculateScore(act, tags)
  })).sort((a, b) => b.score - a.score);
  
  // Compose day-by-day itinerary
  const itinerary = {};
  for (let day = 1; day <= duration; day++) {
    const dayActivities = scoredActivities.slice((day - 1) * 3, day * 3);
    
    itinerary[`day_${day}`] = {
      date: new Date(Date.now() + (day - 1) * 24 * 60 * 60 * 1000),
      morning: dayActivities.find(a => a.best_time === 'morning'),
      afternoon: dayActivities.find(a => a.best_time === 'afternoon'),
      evening: dayActivities.find(a => a.best_time === 'evening'),
    };
  }
  
  // Select hotel
  const hotel = await Hotel.findOne({
    destination: location,
    experiential_tags: { $in: tags }
  }).sort({ user_rating: -1 });
  
  return { itinerary, hotel, total_activities: scoredActivities.length };
};

function calculateScore(activity, queryTags) {
  const tagOverlap = activity.experiential_tags.filter(t => queryTags.includes(t)).length;
  return (tagOverlap * 3) + (activity.user_rating * 2) + (activity.cost_inr < 1000 ? 1 : 0);
}
```

---

#### **4. AI Travel Sync - Dynamic Replanning (Week 10-11)**

```javascript
// backend/src/services/syncEngine.js
const Activity = require('../models/Activity');

exports.checkConflicts = async (currentActivity, contextChange) => {
  let conflict = false;
  let newConstraint = null;
  
  // Detect conflicts
  if (contextChange.type === 'weather' && contextChange.value === 'rain') {
    if (currentActivity.experiential_tags.includes('outdoors')) {
      conflict = true;
      newConstraint = 'indoors';
    }
  }
  
  if (contextChange.type === 'overcrowding') {
    conflict = true;
    newConstraint = 'alternative_location';
  }
  
  if (!conflict) return null;
  
  // Find alternatives
  const alternatives = await Activity.find({
    destination: currentActivity.destination,
    experiential_tags: { 
      $in: [newConstraint],
      $all: currentActivity.experiential_tags.filter(t => t !== 'outdoors')
    },
    duration_hours: { $lte: currentActivity.duration_hours + 1 }
  }).limit(3);
  
  return {
    conflict: true,
    suggestions: alternatives.map(alt => ({
      activity: alt,
      reasoning: generateReasoning(contextChange, currentActivity, alt),
      relevance_score: calculateRelevance(currentActivity, alt)
    }))
  };
};

function generateReasoning(context, original, alternative) {
  if (context.type === 'weather' && context.value === 'rain') {
    return `It's raining! Instead of ${original.name} (outdoors), visit ${alternative.name} (indoors, ${alternative.category}).`;
  }
  return `Due to ${context.type}, we suggest ${alternative.name} as an alternative.`;
}
```

---

#### **5. Maps Integration (Week 13)**

```javascript
// frontend/src/components/maps/ItineraryMap.jsx
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

function ItineraryMap({ activities }) {
  const center = [activities[0].location.lat, activities[0].location.lng];
  
  // Create route coordinates
  const routeCoordinates = activities.map(a => [a.location.lat, a.location.lng]);
  
  return (
    <MapContainer center={center} zoom={13} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      
      {activities.map((activity, idx) => (
        <Marker 
          key={activity._id} 
          position={[activity.location.lat, activity.location.lng]}
        >
          <Popup>
            <strong>{activity.name}</strong><br />
            {activity.category} • {activity.duration_hours}h<br />
            ₹{activity.cost_inr}
          </Popup>
        </Marker>
      ))}
      
      <Polyline positions={routeCoordinates} color="blue" />
    </MapContainer>
  );
}

export default ItineraryMap;
```

---

## 🛠️ **PART 2: DEVELOPMENT ENVIRONMENT SETUP**

### **Day 1 Setup Checklist**

#### **Install Required Software:**

```bash
# 1. Node.js (v18 LTS)
# Download from: https://nodejs.org/

# 2. MongoDB Compass
# Download from: https://www.mongodb.com/try/download/compass

# 3. VS Code
# Download from: https://code.visualstudio.com/

# 4. Git
# Download from: https://git-scm.com/

# 5. Postman
# Download from: https://www.postman.com/downloads/
```

#### **Initialize Project:**

```bash
# Create project folder
mkdir aura-travel
cd aura-travel

# Initialize Git
git init
git config user.name "Your Name"
git config user.email "your@email.com"

# Create folder structure
mkdir frontend backend database docs

# Initialize frontend (React)
cd frontend
npx create-react-app .
# OR with Vite (faster)
npm create vite@latest . -- --template react

# Install frontend dependencies
npm install axios react-router-dom @mui/material @emotion/react @emotion/styled
npm install react-leaflet leaflet compromise date-fns react-hook-form

# Initialize backend
cd ../backend
npm init -y

# Install backend dependencies
npm install express mongoose bcrypt jsonwebtoken cors dotenv express-validator morgan
npm install --save-dev nodemon

# Create basic backend structure
mkdir src
cd src
mkdir config models routes controllers services middleware utils
touch server.js
```

#### **Configure Package.json (Backend):**

```json
{
  "name": "aura-travel-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^7.0.0",
    "bcrypt": "^5.1.0",
    "jsonwebtoken": "^9.0.0",
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express-validator": "^7.0.0",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^2.0.20"
  }
}
```

#### **Create .env File:**

```bash
# backend/.env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/auratravel
JWT_SECRET=your-super-secret-key-change-this
FRONTEND_URL=http://localhost:3000
```

#### **Basic Server Setup:**

```javascript
// backend/src/server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is working!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
```

---

## 📊 **PART 3: DATA CURATION GUIDE**

### **How to Build 110+ Entity Database**

#### **Week 3-4: Initial Data Collection (20 entities)**

**Sources:**
1. **TripAdvisor** - Activity descriptions, ratings
2. **Google Maps** - Locations, photos, opening hours
3. **Travel Blogs** - Experiential descriptions
4. **Personal Research** - Tag assignments

**Process:**

**Step 1: Choose Pilot Destination (Goa)**

**Step 2: Identify Activity Categories:**
- Beach activities (5)
- Cultural sites (5)
- Adventure sports (3)
- Leisure/relaxation (4)
- Nightlife (3)

**Step 3: For Each Activity, Collect:**
```json
{
  "name": "Baga Beach Sunbathing",
  "destination": "Goa",
  "category": "leisure",
  "description": "Popular beach known for water sports and vibrant atmosphere. Long stretch of golden sand perfect for sunbathing and beach walks.",
  "experiential_tags": ["outdoors", "beach", "relaxing", "social", "budget_friendly", "family_friendly"],
  "duration_hours": 3,
  "cost_inr": 200,
  "opening_hours": { "weekday": "24/7", "weekend": "24/7" },
  "location": { "lat": 15.5557, "lng": 73.7537, "address": "Baga Beach Road, Calangute, Goa" },
  "images": ["https://unsplash.com/photos/beach1"],
  "user_rating": 4.5,
  "accessibility": "wheelchair_accessible",
  "best_time": "morning"
}
```

**Step 4: Tag Assignment Process:**

For each activity, ask:
1. **Environment:** Indoors or outdoors? Beach/mountain/city?
2. **Vibe:** Peaceful/adventurous/romantic/social?
3. **Budget:** Cheap (<500), Medium (500-2000), Expensive (>2000)?
4. **Who:** Solo/family/couples/groups?
5. **Time:** Best in morning/afternoon/evening?

**Aim for 8-12 tags per entity.**

---

#### **Week 8: Scale to 110+ Entities**

**Distribution:**
- **Goa:** 60 activities (beaches, forts, churches, markets, nightlife)
- **Manali:** 30 activities (trekking, temples, cafes, adventure sports)
- **Pune:** 20 activities (historical sites, cafes, parks, malls)
- **Hotels:** 30 across all destinations
- **Restaurants:** 20 across all destinations

**Time Estimate:** 
- 1 activity = 15-20 minutes research + tagging
- 110 activities = ~30 hours total
- Split among 4 team members = 7.5 hours each

**Tools to Speed Up:**
```python
# Simple Python script to scrape basic info (use responsibly)
import requests
from bs4 import BeautifulSoup

# Get TripAdvisor ratings, descriptions (manually verify)
# Get Google Maps coordinates (use Maps API or manual)
# Generate template JSON, fill in tags manually
```

---

## 🧪 **PART 4: TESTING & QA STRATEGY**

### **Testing Phases**

#### **Week 15: Comprehensive Testing**

**1. Unit Testing (Backend)**
```bash
npm install --save-dev jest supertest

# Run tests
npm test
```

**Example Test:**
```javascript
// backend/tests/auth.test.js
const request = require('supertest');
const app = require('../src/server');

describe('Auth Endpoints', () => {
  test('POST /api/auth/register creates new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'test@example.com', password: 'pass123' });
    
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.token).toBeDefined();
  });
});
```

**2. Frontend Component Testing**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom
```

**3. Integration Testing Checklist**

- [ ] User registers → Creates DB entry → Returns JWT
- [ ] User logs in → JWT valid → Access protected routes
- [ ] Query submitted → NLP extracts tags → Returns itinerary
- [ ] Itinerary displayed → Shows activities → Map renders
- [ ] Conflict simulated → Alternative suggested → User can accept
- [ ] Booking flow → Flight + Hotel → Confirmation

**4. Manual Testing Scenarios**

| Test Case | Steps | Expected Result |
|-----------|-------|-----------------|
| Happy Path | User types "peaceful mountains 3 days" → Submit | Shows Manali itinerary with yoga, nature walks |
| Edge Case | User types gibberish "asdfgh" → Submit | Shows error: "Couldn't understand query" |
| Conflict | Start live trip → Simulate rain on beach activity | Suggests indoor museum alternative |
| Mobile | Open on mobile phone | All elements visible, touch-friendly |

---

## 🚀 **PART 5: DEPLOYMENT CHECKLIST**

### **Week 16: Production Deployment**

#### **Frontend (Vercel)**

```bash
# 1. Push code to GitHub
git add .
git commit -m "Production ready"
git push origin main

# 2. Go to vercel.com
# 3. Import GitHub repository
# 4. Set environment variables:
VITE_API_URL=https://auratravel-api.onrender.com

# 5. Deploy (automatic)
```

#### **Backend (Render)**

```bash
# 1. Create render.com account
# 2. New Web Service → Connect GitHub repo
# 3. Settings:
Build Command: npm install
Start Command: node src/server.js

# 4. Environment Variables:
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
FRONTEND_URL=https://auratravel.vercel.app

# 5. Deploy
```

#### **Database (MongoDB Atlas)**

```bash
# 1. Create cluster (M0 Free)
# 2. Network Access → Add IP: 0.0.0.0/0
# 3. Database Access → Create user
# 4. Get connection string
# 5. Add to Render environment variables
```

---

## 📖 **PART 6: QUICK REFERENCE**

### **Common Commands**

```bash
# Frontend
npm start              # Start dev server
npm run build         # Production build
npm test              # Run tests

# Backend
npm run dev           # Start with nodemon
npm start             # Production start
npm test              # Run tests

# Git Workflow
git checkout -b feature/new-feature
git add .
git commit -m "Add new feature"
git push origin feature/new-feature
# Create Pull Request on GitHub
```

### **Troubleshooting**

**Issue:** MongoDB connection error  
**Solution:** Check MONGODB_URI in .env, ensure MongoDB is running

**Issue:** CORS error  
**Solution:** Add frontend URL to CORS whitelist in backend

**Issue:** JWT token invalid  
**Solution:** Check JWT_SECRET matches between frontend/backend

**Issue:** Map not displaying  
**Solution:** Import Leaflet CSS: `import 'leaflet/dist/leaflet.css'`

---

## ✅ **READY TO START!**

**You now have:**
1. ✅ 16-week roadmap
2. ✅ Complete technical architecture
3. ✅ Implementation guides for all features
4. ✅ Setup instructions
5. ✅ Data curation process
6. ✅ Testing strategy
7. ✅ Deployment plan

**Start with Week 1 tasks from the roadmap and build incrementally!**

**Good luck building Aura Travel! 🚀💻**