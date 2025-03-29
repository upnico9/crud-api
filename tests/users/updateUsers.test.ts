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

describe('PATCH /api/users/:id', () => {
  it('should allow a user to update their own name', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { firstName: 'UpdatedName' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('firstName', 'UpdatedName');
  });

  it('should allow an admin to update another user', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[5].id}`,
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { lastName: 'AdminUpdated' },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('lastName', 'AdminUpdated');
  });

  it('should forbid a user from updating another user', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[5].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { lastName: 'ShouldNotWork' },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should forbid non-admins from changing role', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { role: 'ADMIN' },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should return 409 if email is already used', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { email: users[0].email }, // email déjà utilisé
    });

    expect(res.statusCode).toBe(409);
  });

  it('should return 400 if email is invalid', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { email: 'not-an-email' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 404 if user does not exist', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/00000000-0000-0000-0000-000000000000',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { firstName: 'Ghost' },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 for invalid UUID', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: '/api/users/not-a-uuid',
      headers: { authorization: `Bearer ${adminToken}` },
      payload: { firstName: 'Fail' },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 if no token is provided', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      payload: { firstName: 'Fail' },
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 if unknown field is sent in body', async () => {
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: {
        unknownField: 'hello unkwown field'
      },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should allow a user to update their password', async () => {
    const newPassword = 'newpass123';
  
    const res = await app.inject({
      method: 'PATCH',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
      payload: { password: newPassword },
    });
  
    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('id', users[4].id);
  
    const loginRes = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: {
        email: users[4].email,
        password: newPassword,
      },
    });
  
    expect(loginRes.statusCode).toBe(200);
    expect(loginRes.json()).toHaveProperty('accessToken');
  });
  
});
