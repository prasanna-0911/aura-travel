# Aura Travel Setup

## Requirements

- Node.js 18 or newer.
- MongoDB local server or MongoDB Atlas connection string.

## Environment

Copy `backend/.env.example` to `backend/.env` and update:

```bash
MONGODB_URI=mongodb://localhost:27017/auratravel
JWT_SECRET=change-this-super-secret-key
FRONTEND_URL=http://localhost:5173
```

For the frontend, `VITE_API_URL` is optional. If omitted, it defaults to:

```bash
http://localhost:5000/api
```

## Install

```bash
npm install
npm --prefix backend install
```

## Seed Data

```bash
npm run backend:seed
```

The seed combines the existing frontend data with curated expansion records.

Default seeded users:

- Admin: `admin@auratravel.local` / `Admin@12345`
- User: `user@auratravel.local` / `User@12345`

Change these in `backend/.env` before seeding if needed.

## Run Locally

Terminal 1:

```bash
npm run backend:dev
```

Terminal 2:

```bash
npm run dev
```

## Verification

```bash
npm run build
npm run backend:smoke
```

`backend:smoke` requires a reachable `MONGODB_URI` and seeded catalog data.
