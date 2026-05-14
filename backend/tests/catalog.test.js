const request = require('supertest');
const app = require('../src/app');

describe('Catalog API Tests', () => {
  describe('GET /api/activities', () => {
    it('should return activities list', async () => {
      const res = await request(app).get('/api/activities');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.activities).toBeInstanceOf(Array);
    });

    it('should filter activities by destination', async () => {
      const res = await request(app).get('/api/activities?destination=Goa');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.activities.length > 0) {
        expect(res.body.activities[0].destination).toBe('Goa');
      }
    });

    it('should filter activities by category', async () => {
      const res = await request(app).get('/api/activities?category=leisure');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      if (res.body.activities.length > 0) {
        expect(res.body.activities[0].category).toBe('leisure');
      }
    });

    it('should search activities', async () => {
      const res = await request(app).get('/api/activities?search=beach');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should sort activities', async () => {
      const res = await request(app).get('/api/activities?sortBy=rating');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/hotels', () => {
    it('should return hotels list', async () => {
      const res = await request(app).get('/api/hotels');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.hotels).toBeInstanceOf(Array);
    });

    it('should filter hotels by destination', async () => {
      const res = await request(app).get('/api/hotels?destination=Goa');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });
  });

  describe('GET /api/restaurants', () => {
    it('should return restaurants list', async () => {
      const res = await request(app).get('/api/restaurants');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.restaurants).toBeInstanceOf(Array);
    });
  });

  describe('GET /api/weaver/destinations', () => {
    it('should return available destinations', async () => {
      const res = await request(app).get('/api/weaver/destinations');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.destinations).toBeInstanceOf(Array);
      expect(res.body.destinations).toContain('Goa');
    });
  });

  describe('GET /api/weaver/tags', () => {
    it('should return available tags', async () => {
      const res = await request(app).get('/api/weaver/tags');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.tags).toBeInstanceOf(Object);
    });
  });
});