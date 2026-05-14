const request = require('supertest');
const app = require('../src/app');

describe('Booking API Tests', () => {
  let token;

  beforeAll(async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Booking Test User',
        email: `booking${Date.now()}@example.com`,
        password: 'TestPass123'
      });
    token = res.body.token;
  });

  describe('GET /api/flights', () => {
    it('should return flights list', async () => {
      const res = await request(app).get('/api/flights');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.flights).toBeInstanceOf(Array);
    });

    it('should filter flights by origin', async () => {
      const res = await request(app).get('/api/flights?origin=BOM');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should filter flights by destination', async () => {
      const res = await request(app).get('/api/flights?destination=PNQ');

      expect(res.statusCode).toBe(200);
    });
  });

  describe('GET /api/bookings', () => {
    it('should return user bookings with authentication', async () => {
      const res = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookings).toBeInstanceOf(Array);
    });

    it('should return empty bookings for unauthenticated user', async () => {
      const res = await request(app).get('/api/bookings');

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.bookings).toEqual([]);
    });
  });

  describe('POST /api/bookings/confirm', () => {
    it('should create booking with valid data', async () => {
      const bookingData = {
        contactDetails: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '1234567890'
        },
        totalCost: 15000,
        destination: 'Goa',
        hotelBooking: {
          hotel: { name: 'Taj Hotel' },
          totalPrice: 15000
        }
      };

      const res = await request(app)
        .post('/api/bookings/confirm')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.booking_confirmation).toHaveProperty('id');
      expect(res.body.booking_confirmation.status).toBe('confirmed');
    });

    it('should create booking without authentication', async () => {
      const bookingData = {
        contactDetails: {
          name: 'Guest User',
          email: 'guest@example.com',
          phone: '9876543210'
        },
        totalCost: 10000,
        destination: 'Manali'
      };

      const res = await request(app)
        .post('/api/bookings/confirm')
        .send(bookingData);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
    });

    it('should reject booking without contact details', async () => {
      const res = await request(app)
        .post('/api/bookings/confirm')
        .send({ totalCost: 1000 });

      expect(res.statusCode).toBe(400);
    });
  });
});