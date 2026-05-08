const request = require('supertest');
const app = require('../src/app');

describe('health endpoint', () => {
  test('GET /api/health responds with status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('ok');
  });
});
