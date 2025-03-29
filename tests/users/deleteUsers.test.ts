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

describe('DELETE /api/users/:id', () => {
  it('should allow an admin to delete a user', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/${users[5].id}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(200);
    expect(res.json()).toHaveProperty('message');
  });

  it('should allow a user to delete themselves', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/${users[4].id}`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(200);
  });

  it('should forbid an admin from deleting themselves', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/${users[0].id}`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should forbid a user from deleting another user', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/${users[6].id}`,
      headers: { authorization: `Bearer ${userToken}` },
    });

    expect(res.statusCode).toBe(403);
  });

  it('should return 404 if user does not exist', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/00000000-0000-0000-0000-000000000000`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(404);
  });

  it('should return 400 if ID is invalid', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/not-a-uuid`,
      headers: { authorization: `Bearer ${adminToken}` },
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 401 without authentication', async () => {
    const res = await app.inject({
      method: 'DELETE',
      url: `/api/users/${users[6].id}`,
    });

    expect(res.statusCode).toBe(401);
  });
});
