import { signRefreshToken, verifyAccessToken } from '../../src/services/jwtService';
import { setupTestApp, closeTestApp } from '../utils/testSetup';

let app: any;
let users: any;

beforeAll(async () => {
  const result = await setupTestApp();
  app = result.app;
  users = result.users;
});

afterAll(async () => {
  await closeTestApp();
});


describe('POST /auth/refresh', () => {
  test('should return new access token with valid refresh token', async () => {
    const user = users[0];
    const token = signRefreshToken({ sub: user.id, role: user.role });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken: token },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();
    expect(body).toHaveProperty('accessToken');
  });

  test('should return 400 if body is missing', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
    });

    expect(res.statusCode).toBe(400);
  });

  test('should return 401 if refreshToken is not a string', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken: 123 },
    });

    expect(res.statusCode).toBe(401);
  });

  test('should return 401 with invalid refresh token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken: 'invalid.token.here' },
    });

    expect(res.statusCode).toBe(401);
  });

  test('should return 401 if user no longer exists', async () => {
    const fakeToken = signRefreshToken({ sub: 'nonexistent-id', role: 'USER' });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken: fakeToken },
    });

    expect(res.statusCode).toBe(401);
  });

  test('should return 401 if user role has changed', async () => {
    const user = users[0];
    const fakeToken = signRefreshToken({ sub: user.id, role: 'USER' });

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken: fakeToken },
    });

    expect(res.statusCode).toBe(401);
  });

  test('should allow login and refresh', async () => {
    const user = users[0];

    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: user.email,
        password: user.password, 
      },
    });

    expect(loginRes.statusCode).toBe(200);
    const { refreshToken } = loginRes.json();
    expect(refreshToken).toBeDefined();

    const refreshRes = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken },
    });

    expect(refreshRes.statusCode).toBe(200);
    const { accessToken } = refreshRes.json();
    expect(accessToken).toBeDefined();
  });

  it('should return a valid new access token', async () => {
    const user = users[1];
    
    const loginRes = await app.inject({
        method: 'POST',
        url: '/api/auth/login',
        payload: {
          email: user.email,
          password: user.password, 
        },
      });

    const { refreshToken } = loginRes.json();

    const res = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      payload: { refreshToken },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('accessToken');

    const { accessToken } = res.json();

    const decoded = verifyAccessToken(accessToken) as any;

    expect(decoded).toBeDefined();
    expect(decoded).toHaveProperty('sub', user.id);
    expect(decoded).toHaveProperty('role', user.role);
  });

});
