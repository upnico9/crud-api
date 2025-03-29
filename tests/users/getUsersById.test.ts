import { setupTestApp } from '../utils/testSetup';

let app:any, users:any;
let adminToken: string;
let userToken: string;

beforeAll(async () => {
  const result = await setupTestApp();
  app = result.app;
  users = result.users;

  const adminLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: users[0].email,
      password: users[0].password,
    },
  });

  adminToken = adminLogin.json().accessToken;

  const userLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: users[4].email,
      password: users[4].password,
    },
  });

  userToken = userLogin.json().accessToken;
});

describe('GET /api/users/:id', () => {
  it('should return a user by ID for an admin', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', users[4].id);
  });

  it('should allow a user to fetch their own data', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', users[4].id);
  });

  it('should forbid a user from accessing another user’s data', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/users/${users[5].id}`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should return 404 if user not found', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users/00000000-0000-0000-0000-000000000000',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid UUID', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users/not-a-valid-id',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await app.inject({
      method: 'GET',
      url: `/api/users/${users[0].id}`,
    });

    expect(res.statusCode).toBe(401);
  });
});
