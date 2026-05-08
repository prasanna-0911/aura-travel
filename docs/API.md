# Aura Travel API

Base URL:

```bash
http://localhost:5000/api
```

## Auth

- `POST /auth/register`
  - Body: `{ "name": "...", "email": "...", "password": "..." }`
- `POST /auth/login`
  - Body: `{ "email": "...", "password": "..." }`
- `GET /auth/profile`
  - Header: `Authorization: Bearer <token>`
- `PUT /auth/profile`
  - Header: `Authorization: Bearer <token>`
  - Body: `{ "name": "...", "preferences": { ... } }`

## Catalog

- `GET /activities?destination=Goa&category=leisure&search=beach`
- `GET /hotels?destination=Manali`
- `GET /restaurants?destination=Pune`

Catalog list endpoints return `{ success, total, page, pages, <items> }`.

## Experience Weaver

- `POST /weaver/generate`
  - Body: `{ "query": "peaceful beach trip for 3 days", "duration": 3 }`
  - Returns extracted NLP tags and a frontend-shaped `itinerary`.
- `GET /weaver/destinations`
- `GET /weaver/tags`

## Live Trips And Sync

- `POST /trips/start`
  - Body: `{ "itinerary": { ... } }`
- `GET /trips/current`
  - Requires auth.
- `POST /sync/check-conflicts`
  - Body: `{ "currentActivity": { ... }, "contextChange": { "type": "weather_rain", "severity": "medium" }, "destination": "Goa" }`
- `POST /sync/accept-suggestion`
  - Body: `{ "trip_id": "...", "suggested_activity_id": "goa-002" }`

## Booking

- `GET /flights?origin=Pune&destination=Goa&date=2026-06-01`
- `GET /hotels?destination=Goa&checkin=2026-06-01&checkout=2026-06-04`
- `POST /bookings/confirm`
  - Mock confirmation only. No real payment or external booking occurs.

## Admin

Admin routes require an admin JWT.

- `GET /admin/activities`
- `POST /admin/activities`
- `PUT /admin/activities/:id`
- `DELETE /admin/activities/:id`
- `GET /admin/analytics`
