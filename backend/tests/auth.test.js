const request = require('supertest');
const app = require('../src/app');

describe('Auth API Tests', () => {
  let testUser = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'TestPass123'
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('id');
      expect(res.body.user.email).toBe(testUser.email);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject duplicate email registration', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const res = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should reject invalid email', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'invalid', password: 'password' });

      expect(res.statusCode).toBe(400);
    });

    it('should reject short password', async () => {
      const res = await request(app)
        .post('/api/auth/register')
        .send({ name: 'Test', email: 'test@test.com', password: '123' });

      expect(res.statusCode).toBe(400);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: testUser.email, password: testUser.password });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty('token');
    });

    it('should reject invalid credentials', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'notfound@test.com', password: 'wrongpass' });

      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/profile', () => {
    it('should get user profile with valid token', async () => {
      const registerRes = await request(app)
        .post('/api/auth/register')
        .send({ ...testUser, email: `profile${Date.now()}@example.com` });

      const token = registerRes.body.token;

      const res = await request(app)
        .get('/api/auth/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.user).toHaveProperty('email');
    });

    it('should reject request without token', async () => {
      const res = await request(app)
        .get('/api/auth/profile');

      expect(res.statusCode).toBe(401);
    });
  });
});