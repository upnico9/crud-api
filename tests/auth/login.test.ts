import request from 'supertest';
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


describe('POST /api/auth/login', () => {
    it('should login with correct credentials', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: users[0].email,
        password: users[0].password,
      });
  
      expect(res.statusCode).toBe(200);
      expect(res.body.accessToken).toBeDefined();
      expect(res.body.refreshToken).toBeDefined();
    });
  
    it('should return 401 for wrong password', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: users[0].email,
        password: 'wrongpassword',
      });
  
      expect(res.statusCode).toBe(401);
    });
  
    it('should return 401 for non-existent user', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: 'doesnotexist@example.com',
        password: 'testpass123',
      });
  
      expect(res.statusCode).toBe(401);
    });
  
    it('should return 400 if email is missing', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        password: 'testpass123',
      });
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 400 if password is missing', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: users[0].email,
      });
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 400 if email is empty', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: '',
        password: 'testpass123',
      });
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 400 if password is empty', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: users[0].email,
        password: '',
      });
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 400 with completely empty payload', async () => {
      const res = await request(app.server).post('/api/auth/login').send({});
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 415 for invalid content-type', async () => {
      const res = await request(app.server)
        .post('/api/auth/login')
        .set('Content-Type', 'text/plain')
        .send('email=test@example.com&password=1234');
  
      expect(res.statusCode).toBeGreaterThanOrEqual(400);
    });
  
    it('should return 400 if email is invalid format', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: 'notanemail',
        password: 'testpass123',
      });
  
      expect(res.statusCode).toBe(400);
    });
  
    it('should return 400 if email contains possible injection', async () => {
      const res = await request(app.server).post('/api/auth/login').send({
        email: "' OR 1=1 --",
        password: 'testpass123',
      });
  
      expect(res.statusCode).toBe(400);
    });
  });
  
