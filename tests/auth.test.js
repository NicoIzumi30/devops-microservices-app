const request = require('supertest');
const app = require('../src/index');

describe('Authentication Tests', () => {
  test('POST /api/auth/login with valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('token');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'admin');
  });

  test('POST /api/auth/login with invalid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'wrongpassword'
      })
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Invalid credentials');
  });

  test('GET /api/auth/profile without token', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .expect(401);

    expect(response.body).toHaveProperty('error', 'Access token required');
  });

  test('GET /api/auth/profile with valid token', async () => {
    // First login to get token
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin',
        password: 'admin123'
      });

    const token = loginResponse.body.token;

    // Then access protected route
    const response = await request(app)
      .get('/api/auth/profile')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Protected route accessed');
    expect(response.body).toHaveProperty('user');
  });
});