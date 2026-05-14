const request = require('supertest');
const app = require('../src/app');

describe('Weaver API Tests', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Weaver Test User',
        email: `weaver${Date.now()}@example.com`,
        password: 'TestPass123'
      });
    token = res.body.token;
  });

  describe('POST /api/weaver/generate', () => {
    it('should generate itinerary with valid query', async () => {
      const res = await request(app)
        .post('/api/weaver/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          query: 'I want a 2 day beach vacation in Goa',
          duration: 2,
          destination: 'Goa'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.itinerary).toHaveProperty('days');
      expect(res.body.itinerary.days).toHaveLength(2);
      expect(res.body.itinerary).toHaveProperty('hotel');
    });

    it('should reject short query', async () => {
      const res = await request(app)
        .post('/api/weaver/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: 'hi' });

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should extract destination from query', async () => {
      const res = await request(app)
        .post('/api/weaver/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({ query: 'beach trip in Goa for 3 days' });

      expect(res.statusCode).toBe(200);
      expect(res.body.destination).toBe('Goa');
    });

    it('should work without authentication', async () => {
      const res = await request(app)
        .post('/api/weaver/generate')
        .send({ query: 'beach trip in Goa for 2 days' });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });
});

describe('Trip API Tests', () => {
  let token;
  let tripId;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Trip Test User',
        email: `trip${Date.now()}@example.com`,
        password: 'TestPass123'
      });
    token = res.body.token;
  });

  describe('POST /api/trips/start', () => {
    it('should create trip with valid itinerary', async () => {
      const itinerary = {
        id: 'test-itinerary-1',
        destination: 'Goa',
        duration: 2,
        days: [
          {
            day: 1,
            date: '2026-05-15',
            activities: [
              { timeSlot: 'morning', activity: { id: 'goa-001', name: 'Beach Walk' } },
              { timeSlot: 'afternoon', activity: { id: 'goa-002', name: 'Sunset' } }
            ]
          },
          {
            day: 2,
            date: '2026-05-16',
            activities: [
              { timeSlot: 'morning', activity: { id: 'goa-003', name: 'Yoga' } }
            ]
          }
        ],
        hotel: { name: 'Test Hotel' },
        totalCost: 10000
      };

      const res = await request(app)
        .post('/api/trips/start')
        .set('Authorization', `Bearer ${token}`)
        .send({ itinerary });

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('trip_id');
      tripId = res.body.trip_id;
    });

    it('should reject trip without itinerary', async () => {
      const res = await request(app)
        .post('/api/trips/start')
        .set('Authorization', `Bearer ${token}`)
        .send({});

      expect(res.statusCode).toBe(400);
    });

    it('should create trip without authentication', async () => {
      const itinerary = {
        id: 'test-itinerary-2',
        destination: 'Goa',
        duration: 1,
        days: [{ day: 1, activities: [] }],
        totalCost: 5000
      };

      const res = await request(app)
        .post('/api/trips/start')
        .send({ itinerary });

      expect(res.statusCode).toBe(201);
    });
  });

  describe('GET /api/trips/current', () => {
    it('should get current active trip', async () => {
      const res = await request(app)
        .get('/api/trips/current')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should reject without authentication', async () => {
      const res = await request(app)
        .get('/api/trips/current');

      expect(res.statusCode).toBe(401);
    });
  });
});