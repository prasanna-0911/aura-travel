# AURA TRAVEL - Master Production Roadmap
## 16-Week Sprint Plan to Production-Ready System

---

## 📊 **PROJECT OVERVIEW**

**Team:** 4 developers (100 hours/week total capacity)  
**Timeline:** 16 weeks (1 semester)  
**Goal:** Full production-ready AI-powered travel platform  
**Budget:** ₹500 (domain only)  
**Tech Stack:** MERN + Leaflet.js + compromise.js

---

## 🎯 **SUCCESS CRITERIA**

**By Week 16, you will have:**
✅ Fully functional website (frontend + backend)  
✅ 110+ real curated travel entities in MongoDB  
✅ Working AI Experience Weaver (NLP → Itinerary)  
✅ Working AI Travel Sync (dynamic replanning)  
✅ User authentication & admin panel  
✅ Mock booking system (flights/hotels)  
✅ Interactive maps with routes  
✅ Mobile-responsive design  
✅ Production-ready code quality  
✅ Complete documentation  
✅ Demo-ready for presentation  

---

## 📅 **16-WEEK SPRINT BREAKDOWN**

### **PHASE 0: FOUNDATION (Week 1)**
**Goal:** Development environment ready, team aligned, tech stack validated

#### **Week 1: Setup & Architecture Planning**
**Team Activity (Everyone):**
- [ ] Development environment setup
- [ ] Git repository created & configured
- [ ] Project folder structure established
- [ ] Design system & UI mockups finalized
- [ ] Database schema designed
- [ ] API contract defined

**Pair 1 (Frontend Focus):**
- [ ] React app initialized with Vite/CRA
- [ ] Install dependencies (React Router, Material-UI/Tailwind)
- [ ] Create basic component structure
- [ ] Setup ESLint & Prettier

**Pair 2 (Backend Focus):**
- [ ] Node.js + Express server initialized
- [ ] MongoDB Atlas account created (free tier)
- [ ] Basic CRUD API for testing
- [ ] CORS & middleware configured

**Deliverables:**
- Working "Hello World" full-stack app
- Team Git workflow established (branching strategy)
- Weekly sprint schedule agreed

**Time Allocation:** 25 hours/person

---

### **PHASE 1: CORE INFRASTRUCTURE (Weeks 2-4)**
**Goal:** User system, database, and basic UI operational

#### **Week 2: User Authentication System**
**Pair 1 (Frontend - Auth UI):**
- [ ] Login page design & implementation
- [ ] Registration page with validation
- [ ] Protected routes setup
- [ ] User profile page
- [ ] JWT token storage & refresh logic

**Pair 2 (Backend - Auth API):**
- [ ] User schema (MongoDB model)
- [ ] POST /api/auth/register endpoint
- [ ] POST /api/auth/login endpoint
- [ ] JWT generation & verification middleware
- [ ] Password hashing (bcrypt)
- [ ] Input validation & error handling

**Deliverables:**
- Users can register and login
- JWT-based authentication working
- Protected routes functional

**Time:** 25 hours/person

---

#### **Week 3: Database Design & Initial Data**
**Pair 1 (Data Curation Team):**
- [ ] Create MongoDB schemas (Activities, Hotels, Restaurants)
- [ ] Define experiential tag vocabulary (95 tags)
- [ ] Curate 20 activities for Goa (pilot)
- [ ] Assign tags manually (8-12 per entity)
- [ ] Add photos/descriptions

**Pair 2 (Admin Panel - Basic):**
- [ ] Admin login page
- [ ] Dashboard layout
- [ ] CRUD interface for activities
- [ ] Form for adding new entities
- [ ] List view with edit/delete

**Deliverables:**
- 20+ real entities in database (Goa pilot)
- Basic admin panel operational
- All entities have experiential tags

**Time:** 25 hours/person

---

#### **Week 4: Core UI Components & Navigation**
**Pair 1 (Frontend - UI Library):**
- [ ] Homepage with hero section
- [ ] Navigation bar (responsive)
- [ ] Footer component
- [ ] Card components for activities/hotels
- [ ] Search bar component (visual only)
- [ ] Mobile responsive breakpoints

**Pair 2 (Backend - Search API Foundation):**
- [ ] GET /api/activities endpoint
- [ ] GET /api/hotels endpoint
- [ ] GET /api/restaurants endpoint
- [ ] Filtering logic (by destination, tags)
- [ ] Sorting & pagination

**Deliverables:**
- Professional-looking homepage
- Browse/search interface (basic)
- API endpoints returning data

**Time:** 25 hours/person

---

### **PHASE 2: AI EXPERIENCE WEAVER (Weeks 5-8)**
**Goal:** Core innovation #1 - NLP-based itinerary generation working

#### **Week 5: NLP Tag Extraction Module**
**Pair 1 (NLP Implementation):**
- [ ] Install compromise.js
- [ ] Create tag extraction function
- [ ] Map adjectives → experiential tags
- [ ] Extract location entities (Goa, Manali, mountains)
- [ ] Extract temporal info (3 days, weekend)
- [ ] Unit tests for NLP module

**Pair 2 (Conversational UI):**
- [ ] Conversational prompt component
- [ ] "What kind of experience..." input field
- [ ] Real-time tag preview (show extracted tags)
- [ ] Example queries for users
- [ ] Loading states & animations

**Deliverables:**
- NLP extracts tags with ~88% accuracy
- User can type natural language queries
- System shows extracted tags

**Time:** 25 hours/person

---

#### **Week 6: Knowledge Graph Query Engine**
**Pair 1 (Backend - Matching Algorithm):**
- [ ] POST /api/weaver/generate endpoint
- [ ] MongoDB query builder (tag matching)
- [ ] Ranking algorithm implementation
  - Score = (tag_overlap × 3) + (rating × 2) + budget
- [ ] Multi-destination search
- [ ] Response formatting (JSON itinerary)

**Pair 2 (Frontend - Results Display):**
- [ ] Itinerary results page design
- [ ] Timeline-based layout (day-by-day)
- [ ] Activity cards with images & tags
- [ ] Map integration (basic markers)
- [ ] "Book This Trip" button (placeholder)

**Deliverables:**
- Query "peaceful mountains 3 days" → Returns Manali itinerary
- Results displayed beautifully
- All tags matched correctly

**Time:** 25 hours/person

---

#### **Week 7: Itinerary Composition Algorithm**
**Pair 1 (Backend - Composer):**
- [ ] Day segmentation logic
- [ ] Time-of-day optimization
  - Morning: Cultural/active
  - Afternoon: Leisure/dining
  - Evening: Entertainment
- [ ] Geographical clustering (minimize travel)
- [ ] Activity diversity check (no repetition)
- [ ] Accommodation selection & placement

**Pair 2 (Frontend - Enhanced Display):**
- [ ] Day-by-day expandable sections
- [ ] Time slots visualization
- [ ] Activity details modal
- [ ] Print/export itinerary (PDF)
- [ ] Share functionality (copy link)

**Deliverables:**
- Complete 3-day itineraries generated
- Logical flow (morning → afternoon → evening)
- Hotels selected optimally

**Time:** 25 hours/person

---

#### **Week 8: Data Expansion & Testing**
**Pair 1 (Data Curation - Scale Up):**
- [ ] Complete Goa dataset (60+ activities total)
- [ ] Start Manali dataset (30+ activities)
- [ ] Add 20+ hotels across destinations
- [ ] Add 15+ restaurants
- [ ] Quality check all tags

**Pair 2 (Testing & Refinement):**
- [ ] Test 20+ different queries
- [ ] Fix edge cases (no results, single activity)
- [ ] Performance optimization (query speed)
- [ ] Error handling improvements
- [ ] User feedback collection

**Deliverables:**
- 110+ entities in database
- AI Experience Weaver working reliably
- Response time < 4.5 seconds

**Time:** 25 hours/person

---

### **PHASE 3: AI TRAVEL SYNC (Weeks 9-11)**
**Goal:** Core innovation #2 - Dynamic replanning operational

#### **Week 9: Context Monitoring System**
**Pair 1 (Backend - Live Trip State):**
- [ ] Trip schema (active itineraries)
- [ ] POST /api/trips/start endpoint
- [ ] GET /api/trips/current (get active trip)
- [ ] Activity status tracking (completed/upcoming)
- [ ] Context change detection logic

**Pair 2 (Frontend - Live Trip UI):**
- [ ] "Live Trip" view component
- [ ] Current activity highlight
- [ ] Next activities timeline
- [ ] Progress indicators
- [ ] "Mark as Complete" buttons

**Deliverables:**
- Users can start a "live trip"
- Current itinerary displayed clearly
- Activity tracking functional

**Time:** 25 hours/person

---

#### **Week 10: Constraint Detection & Alternative Search**
**Pair 1 (Backend - Sync Engine):**
- [ ] POST /api/sync/check-conflicts endpoint
- [ ] Rule-based constraint detection
  - Rain + outdoor → conflict
  - Overcrowding + venue → conflict
- [ ] Alternative search query builder
- [ ] Ranking alternatives (preserve intent)
- [ ] Suggestion formatting

**Pair 2 (Frontend - Simulation Controls):**
- [ ] Developer control panel (for demo)
- [ ] "Simulate Rain" button
- [ ] "Simulate Overcrowding" button
- [ ] "Simulate User Tired" button
- [ ] Context visualization

**Deliverables:**
- Conflict detection working
- System finds suitable alternatives
- Simulation panel functional

**Time:** 25 hours/person

---

#### **Week 11: Proactive Suggestions & UI Polish**
**Pair 1 (Backend - Finalization):**
- [ ] Response time optimization (< 1.5s)
- [ ] Multiple alternatives (top 3)
- [ ] Reasoning text generation
- [ ] Accept/decline alternative logic
- [ ] Itinerary update on acceptance

**Pair 2 (Frontend - Notification System):**
- [ ] Suggestion notification component
- [ ] Slide-in animation
- [ ] Problem description + solution
- [ ] Accept/Decline/See More buttons
- [ ] Auto-dismiss after 30 seconds

**Deliverables:**
- AI Travel Sync fully operational
- Suggestions appear proactively
- User can accept/decline easily

**Time:** 25 hours/person

---

### **PHASE 4: BOOKING SYSTEM & MAPS (Weeks 12-13)**
**Goal:** Mock booking flow and interactive maps

#### **Week 12: Mock Booking Engine**
**Pair 1 (Backend - Mock Data):**
- [ ] Create flights.json (50+ flights)
- [ ] Create hotels.json (30+ hotels)
- [ ] GET /api/flights endpoint
- [ ] GET /api/hotels endpoint
- [ ] Search/filter logic
- [ ] Booking confirmation (mock)

**Pair 2 (Frontend - Booking UI):**
- [ ] Flight search page
- [ ] Flight results display
- [ ] Hotel search page
- [ ] Hotel results with images
- [ ] Booking summary page
- [ ] Confirmation page (mock)

**Deliverables:**
- Users can "book" flights and hotels
- Professional booking flow
- Data looks realistic

**Time:** 25 hours/person

---

#### **Week 13: Maps Integration (Leaflet.js)**
**Pair 1 (Maps - Core Features):**
- [ ] Install Leaflet.js + React-Leaflet
- [ ] Initialize map component
- [ ] Add activity markers (pins)
- [ ] Custom marker icons (activity types)
- [ ] Popup on marker click (activity info)
- [ ] Map centering & zoom

**Pair 2 (Maps - Routes & Interactions):**
- [ ] Draw routes between activities
- [ ] Calculate distances (Leaflet Routing Machine)
- [ ] Show travel time estimates
- [ ] Cluster markers for dense areas
- [ ] Mobile-friendly map controls

**Deliverables:**
- Interactive map showing all activities
- Routes drawn between locations
- Professional appearance

**Time:** 25 hours/person

---

### **PHASE 5: POLISH & PRODUCTION PREP (Weeks 14-15)**
**Goal:** Professional quality, bug-free, optimized

#### **Week 14: UI/UX Polish & Mobile Optimization**
**Pair 1 (Frontend - Refinement):**
- [ ] Consistent color scheme & typography
- [ ] Loading skeletons for all pages
- [ ] Empty states (no results, no trips)
- [ ] Error boundaries (React error handling)
- [ ] Animations & transitions
- [ ] Accessibility improvements (ARIA labels)

**Pair 2 (Responsive Design):**
- [ ] Mobile breakpoints (< 768px)
- [ ] Tablet breakpoints (768-1024px)
- [ ] Touch-friendly buttons (min 44px)
- [ ] Hamburger menu for mobile
- [ ] Optimize images for mobile
- [ ] Test on real devices

**Deliverables:**
- Professional, polished UI
- Perfect mobile experience
- No visual bugs

**Time:** 25 hours/person

---

#### **Week 15: Testing, Bug Fixes, Performance**
**Pair 1 (Quality Assurance):**
- [ ] Write test cases (unit tests)
- [ ] Integration testing (API → Frontend)
- [ ] User acceptance testing (UAT)
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Fix all critical bugs
- [ ] Performance profiling

**Pair 2 (Optimization):**
- [ ] Code splitting (lazy loading)
- [ ] Image optimization (compression, lazy load)
- [ ] Database query optimization
- [ ] Caching strategy (Redis if needed)
- [ ] Bundle size reduction
- [ ] Lighthouse score > 90

**Deliverables:**
- Zero critical bugs
- Fast load times (< 3s)
- Smooth user experience

**Time:** 25 hours/person

---

### **PHASE 6: DEPLOYMENT & DOCUMENTATION (Week 16)**
**Goal:** Production deployment, documentation, demo preparation

#### **Week 16: Launch Week**
**Pair 1 (Deployment):**
- [ ] Frontend deployment (Vercel)
- [ ] Backend deployment (Render/Railway)
- [ ] MongoDB Atlas configuration (production)
- [ ] Domain setup (₹500 budget)
- [ ] SSL certificate (free via host)
- [ ] Environment variables configured
- [ ] Health checks & monitoring

**Pair 2 (Documentation):**
- [ ] README.md (GitHub)
- [ ] User manual (PDF)
- [ ] API documentation (Postman collection)
- [ ] Admin guide
- [ ] Setup instructions
- [ ] Demo script for presentation
- [ ] Video walkthrough (5 min)

**Deliverables:**
- Live website accessible online
- Complete documentation
- Demo-ready presentation

**Time:** 25 hours/person

---

## 📊 **WEEKLY COMMITMENT TRACKER**

| Week | Pair 1 Focus | Pair 2 Focus | Total Hours | Deliverable |
|------|--------------|--------------|-------------|-------------|
| 1 | Frontend Setup | Backend Setup | 100h | Dev environment ready |
| 2 | Auth UI | Auth API | 100h | Login/Register working |
| 3 | Data Curation | Admin Panel | 100h | 20+ entities in DB |
| 4 | Core UI | Search API | 100h | Homepage complete |
| 5 | NLP Module | Conversational UI | 100h | Tag extraction working |
| 6 | Matching Algorithm | Results Display | 100h | Query → Results |
| 7 | Composer Algorithm | Enhanced Display | 100h | Complete itineraries |
| 8 | Data Expansion | Testing & QA | 100h | 110+ entities |
| 9 | Live Trip State | Live Trip UI | 100h | Trip tracking |
| 10 | Conflict Detection | Simulation Panel | 100h | AI Sync foundation |
| 11 | Suggestions | Notifications | 100h | AI Sync complete |
| 12 | Mock Booking API | Booking UI | 100h | Booking flow |
| 13 | Maps Core | Maps Routes | 100h | Interactive maps |
| 14 | UI Polish | Responsive Design | 100h | Mobile-ready |
| 15 | Testing | Optimization | 100h | Production quality |
| 16 | Deployment | Documentation | 100h | LAUNCH! |

**Total:** 1,600 hours (400 hours/person)

---

## 🎯 **MILESTONE CHECKPOINTS**

### **End of Month 1 (Week 4):**
✅ Users can login  
✅ 20+ activities in database  
✅ Basic homepage functional  
**Demo:** Show user authentication & browse activities

### **End of Month 2 (Week 8):**
✅ AI Experience Weaver operational  
✅ 110+ entities curated  
✅ Itineraries generated from natural language  
**Demo:** "I want a peaceful beach trip" → Full 3-day Goa itinerary

### **End of Month 3 (Week 12):**
✅ AI Travel Sync working  
✅ Mock booking flow complete  
✅ Maps integrated  
**Demo:** Simulate rain → System suggests indoor alternative

### **End of Month 4 (Week 16):**
✅ Production-ready system  
✅ Deployed online  
✅ Documentation complete  
**Demo:** Full end-to-end user journey

---

## ⚠️ **RISK MITIGATION**

### **Risk 1: Data Curation Taking Too Long**
**Mitigation:**
- Start with semi-real data (real names, simplified descriptions)
- Use web scraping tools (BeautifulSoup) to speed up
- Divide destinations among team (each person = 1 destination)

### **Risk 2: NLP Accuracy Below 88%**
**Mitigation:**
- Focus on simple queries first
- Build comprehensive tag dictionary
- Add Gemini API fallback for complex queries (Week 10+)

### **Risk 3: Running Behind Schedule**
**Mitigation:**
- Daily 15-min standups (track blockers)
- Move Priority 2 features to post-launch
- Reduce admin panel to basic version

### **Risk 4: Technical Blockers**
**Mitigation:**
- Stack Overflow / Documentation first
- Team pair programming (solve together)
- Prof. Radhika Malpani as escalation point

---

## 🏆 **DEFINITION OF DONE (WEEK 16)**

**Production-Ready Checklist:**
- [ ] All Priority 1 features implemented & tested
- [ ] Zero critical bugs, < 5 minor bugs
- [ ] Mobile responsive (tested on 3+ devices)
- [ ] Page load time < 3 seconds
- [ ] 110+ real entities with tags in database
- [ ] User authentication secure (JWT, bcrypt)
- [ ] Admin panel functional
- [ ] Documentation complete
- [ ] Deployed online with custom domain
- [ ] Demo video recorded
- [ ] Code on GitHub with README

**When all checked → PRODUCTION READY!** 🚀

---

## 📞 **TEAM COORDINATION**

**Daily Standup (15 min):**
- What did I complete yesterday?
- What will I do today?
- Any blockers?

**Weekly Sprint Review (Friday, 1 hour):**
- Demo week's work
- Review vs plan
- Plan next week

**Tools:**
- **Git:** Feature branches, PRs, code reviews
- **Trello/Jira:** Task tracking
- **Slack/Discord:** Team communication
- **Figma:** UI/UX designs
- **Postman:** API testing

---

## 🎓 **NEXT STEPS - START NOW!**

### **TODAY (Day 1):**
1. Create GitHub repository
2. Initialize React app (Pair 1)
3. Initialize Express app (Pair 2)
4. Setup MongoDB Atlas account
5. Create project folder structure

### **THIS WEEK (Week 1):**
- Follow Week 1 checklist above
- Setup development environment
- Design database schema
- Create UI mockups

**You're ready to start coding! Check the other artifacts for detailed technical specs.** 💻🚀