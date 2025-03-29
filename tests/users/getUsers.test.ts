import { setupTestApp } from '../utils/testSetup';

let app:any, users: any;
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

describe('GET /api/users', () => {
  it('should return a paginated list of users (default params)', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    const body = res.json();

    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('pagination');
    expect(body.data.length).toBeGreaterThan(0);
    expect(body.pagination).toHaveProperty('total');
    expect(body.pagination).toHaveProperty('page');
    expect(body.pagination).toHaveProperty('limit');
    expect(body.pagination).toHaveProperty('totalPages');
  });

  it('should limit the number of results', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?limit=5',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data).toHaveLength(5);
  });

  it('should return 400 for too high limit', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?limit=999',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should search by email (case-insensitive)', async () => {
    const keyword = users[0].email.split('@')[0].toUpperCase();

    const res = await app.inject({
      method: 'GET',
      url: `/api/users?search=${keyword}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(
      res.json().data.some((u:any) =>
        u.email.toLowerCase().includes(keyword.toLowerCase())
      )
    ).toBe(true);
  });

  it('should return empty list if page is too high', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?page=999',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json().data).toHaveLength(0);
  });

  it('should return 400 for non-numeric page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?page=notanumber',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for non-numeric limit', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?limit=none',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid sortBy', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?sortBy=unknownField',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for invalid order', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?order=sideways',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users',
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 403 for non-admin user', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users',
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should return 400 for negative page', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?page=-1',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for negative limit', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?limit=-10',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for page=0', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?page=0',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 400 for limit=0', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/api/users?limit=0',
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });
});
