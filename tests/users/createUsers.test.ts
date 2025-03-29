import { buildApp } from '../../src/app';
import { resetTestDatabase } from '../utils/testSeeds';

let app: Awaited<ReturnType<typeof buildApp>>;
let users: any;
let tokens: { admin: string; user: string };

beforeAll(async () => {
  users = await resetTestDatabase();
  app = buildApp();
  await app.ready();

  const adminLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: users[0].email,
      password: users[0].password
    }
  });

  const userLogin = await app.inject({
    method: 'POST',
    url: '/api/auth/login',
    payload: {
      email: users[4].email,
      password: users[4].password
    }
  });

  tokens = {
    admin: JSON.parse(adminLogin.body).accessToken,
    user: JSON.parse(userLogin.body).accessToken
  };
});

afterAll(async () => {
  await app.close();
});

describe('POST /users', () => {
  it('should allow an admin to create a new user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { authorization: `Bearer ${tokens.admin}` },
      payload: {
        firstName: 'New',
        lastName: 'User',
        email: 'newuser@example.com',
        password: 'securepass',
        role: 'USER'
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.email).toBe('newuser@example.com');
    expect(body.role).toBe('USER');
  });

  it('should allow an admin to create an admin user', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { authorization: `Bearer ${tokens.admin}` },
      payload: {
        firstName: 'Super',
        lastName: 'Admin',
        email: 'admin99@example.com',
        password: 'adminpass123',
        role: 'ADMIN'
      }
    });

    expect(res.statusCode).toBe(201);
    const body = JSON.parse(res.body);
    expect(body.role).toBe('ADMIN');
  });

  it('should forbid a regular user from creating users', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { authorization: `Bearer ${tokens.user}` },
      payload: {
        firstName: 'Bad',
        lastName: 'Guy',
        email: 'badguy@example.com',
        password: 'notallowed',
        role: 'USER'
      }
    });

    expect(res.statusCode).toBe(403);
  });

  it('should reject request without token', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      payload: {
        firstName: 'Anon',
        lastName: 'User',
        email: 'anon@example.com',
        password: 'noauth',
        role: 'USER'
      }
    });

    expect(res.statusCode).toBe(401);
  });

  it('should return 400 for invalid input', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { authorization: `Bearer ${tokens.admin}` },
      payload: {
        firstName: 'Invalid',
        lastName: 'Input',
        email: 'notanemail',
        password: '123',
        role: 'ADMIN'
      }
    });

    expect(res.statusCode).toBe(400);
  });

  it('should return 409 for duplicate email', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/api/users',
      headers: { authorization: `Bearer ${tokens.admin}` },
      payload: {
        firstName: 'Duplicate',
        lastName: 'Email',
        email: users[1].email,
        password: 'somepass',
        role: 'USER'
      }
    });

    expect(res.statusCode).toBe(409);
  });
});
