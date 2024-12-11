import request from 'supertest';
import app from '../server';
import pool from '../db';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });

describe('Auth API', () => {
  let server;
  let token;

   // Käynnistä palvelin ennen testejä
  beforeAll(async () => {
    server = app.listen(4000, () => {
      console.log('Test server is running on http://localhost:4000');
    });

    // Siivoa tietokanta ennen testejä
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['testuser%']);
  });

   // Sulje palvelin ja tietokantayhteys testien jälkeen
  afterAll(async () => {
    await pool.query('DELETE FROM users WHERE email LIKE $1', ['testuser%']);
    await pool.end();
    server.close();
  });

  // REGISTER
  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const response = await request(server)
        .post('/auth/register')
        .send({ email: 'testuser@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('email', 'testuser@example.com');
    });

    it('POST /auth/register should not register a user with an existing email', async () => {
        // ensin rekisteröinti
        await request(server)
          .post('/auth/register')
          .send({ email: 'testuser@example.com', password: 'Password123' });
      
        // rekisteröinti yritys samalla tunnuksella
        const response = await request(server)
          .post('/auth/register')
          .send({ email: 'testuser@example.com', password: 'Password123' });
      
        expect(response.statusCode).toBe(409);
        expect(response.body).toHaveProperty('error', 'User already exists');
      });
  });

  // LOGIN
   describe('POST /auth/login', () => {
    it('should login a user with valid credentials', async () => {
      await request(server)
        .post('/auth/register')
        .send({ email: 'testuser2@example.com', password: 'Password123' });

      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'testuser2@example.com', password: 'Password123' });

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('token');
      token = response.body.token; // tallentaa tokenin
    });

    it('should not login a user with invalid credentials', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'testuser2@example.com', password: 'WrongPassword' });

      expect(response.statusCode).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return error if email or password is missing', async () => {
      const response = await request(server)
        .post('/auth/login')
        .send({ email: 'testuser2@example.com' });

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('message', 'Missing email or password');
    });
  });

  // DELETE USER
  describe('DELETE /auth/delete', () => {
    it('should delete the user', async () => {
      // rekisteröi, kirjautuu
      await request(server)
        .post('/auth/register')
        .send({ email: 'testuser3@example.com', password: 'Password123' });

      const loginResponse = await request(server)
        .post('/auth/login')
        .send({ email: 'testuser3@example.com', password: 'Password123' });

      expect(loginResponse.statusCode).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
      const deleteToken = loginResponse.body.token;

      // käyttäjän poistaminen
      const deleteResponse = await request(server)
        .delete('/auth/delete')
        .set('Authorization', `Bearer ${deleteToken}`);

      expect(deleteResponse.statusCode).toBe(200);
      expect(deleteResponse.body).toHaveProperty('message', 'User deleted successfully');
    });

    it('should return 401 for invalid token', async () => {
        const deleteResponse = await request(server)
          .delete('/auth/delete')
          .set('Authorization', 'Bearer invalidtoken');
    
        expect(deleteResponse.statusCode).toBe(401);
        expect(deleteResponse.body).toHaveProperty('message', 'Unauthorized');
      });
  });
});