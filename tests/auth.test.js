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
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'admin');
    expect(response.body.user).toHaveProperty('role', 'admin');
    expect(response.body.user).toHaveProperty('id', 1);
  });

  test('POST /api/auth/login with any credentials (always succeeds)', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'anyuser',
        password: 'anypassword'
      })
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Login successful');
    expect(response.body).toHaveProperty('user');
  });

  test('POST /api/auth/login with missing credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'admin'
        // Missing password
      })
      .expect(400);

    expect(response.body).toHaveProperty('error', 'Username and password required');
  });

  test('GET /api/auth/profile (no authentication required)', async () => {
    const response = await request(app)
      .get('/api/auth/profile')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Protected route accessed');
    expect(response.body).toHaveProperty('user');
    expect(response.body.user).toHaveProperty('username', 'admin');
    expect(response.body.user).toHaveProperty('role', 'admin');
  });

  test('POST /api/auth/logout', async () => {
    const response = await request(app)
      .post('/api/auth/logout')
      .expect(200);

    expect(response.body).toHaveProperty('message', 'Logout successful');
  });
});