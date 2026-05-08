# Aura Travel

Aura Travel is an AI-powered travel planning prototype built as a MERN app. The frontend is a Vite React app at the repository root, and the backend lives in `backend/`.

## Features

- Natural-language AI Experience Weaver for itinerary generation.
- AI Travel Sync conflict detection with alternative suggestions.
- Curated travel catalog for Goa, Manali, and Pune.
- Mock flight, hotel, and booking confirmation flow.
- JWT authentication, user profile, and admin activity management.
- React-Leaflet maps using OpenStreetMap tiles.

## Quick Start

```bash
npm install
npm --prefix backend install
copy backend\.env.example backend\.env
npm run backend:seed
npm run backend:dev
npm run dev
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:5000/api/health`

Seeded demo credentials are documented in [docs/SETUP.md](docs/SETUP.md).

## Scripts

- `npm run dev` - start the frontend.
- `npm run build` - typecheck and build the frontend.
- `npm run backend:dev` - start the Express API with nodemon.
- `npm run backend:seed` - seed MongoDB with 110+ catalog entities and demo users.
- `npm run backend:smoke` - verify the seeded catalog count.

## Structure

- `src/` - React frontend.
- `backend/src/` - Express API, Mongoose models, services, and routes.
- `backend/scripts/seed.js` - MongoDB seed script.
- `docs/` - setup, API, and user documentation.
