const request = require('supertest');
const express = require('express');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const dbUtils = require('../utils/dbUtils');
const userController = require('./userController');

const app = express();

// Middleware setup for testing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));

// Mock session middleware
app.use((req, res, next) => {
  req.session = {
    user: null,
    touch: jest.fn(),
    save: jest.fn(),
  };
  next();
});

// Mock rendering
app.use((req, res, next) => {
  res.render = jest.fn((view, options) => `Rendered ${view}`);
  next();
});

// Mock database utility
jest.mock('../utils/dbUtils');

// Routes
app.get('/api/users/welcome', userController.welcomePage);
app.post('/api/users/register', userController.registerUser);
app.post('/api/users/login', userController.loginUser);
app.post('/api/users/logout', userController.logoutUser);
app.get('/api/users/elderly', userController.getElderly);
app.post('/api/users/requests', userController.submitRequest);
app.delete('/api/users/request/:id', userController.deleteRequest);
app.put('/api/users/request/fulfill/:id', userController.fulfillRequest);
app.put('/api/users/request/important/:id', userController.markImportant);

describe('User Controller Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('GET /api/users/welcome - renders the welcome page', async () => {
    const response = await request(app).get('/api/users/welcome');
    expect(response.status).toBe(200);
    expect(res.render).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
  });

  test('POST /api/users/register - registers a new user', async () => {
    dbUtils.getAll.mockResolvedValue([]);
    dbUtils.runQuery.mockResolvedValue();

    const response = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        role: 'elderly',
      });

    expect(response.status).toBe(201);
    expect(response.text).toContain('Registration successful');
  });

  test('POST /api/users/register - returns error if email exists', async () => {
    dbUtils.getAll.mockResolvedValue([{ email: 'jane@example.com' }]);

    const response = await request(app)
      .post('/api/users/register')
      .send({
        firstname: 'Jane',
        lastname: 'Doe',
        email: 'jane@example.com',
        password: 'Password123!',
        role: 'elderly',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Email already exists');
  });

  test('POST /api/users/login - logs in a user', async () => {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    dbUtils.getAll.mockResolvedValue([
      { id: 1, firstname: 'John', lastname: 'Doe', email: 'john@example.com', password: hashedPassword },
    ]);

    const response = await request(app)
      .post('/api/users/login')
      .send({ email: 'john@example.com', password: 'Password123!' });

    expect(response.status).toBe(200);
    expect(req.session.user).toEqual(expect.objectContaining({ id: 1, email: 'john@example.com' }));
  });

  test('POST /api/users/logout - logs out a user', async () => {
    req.session.user = { id: 1, email: 'john@example.com' };
    const response = await request(app).post('/api/users/logout');
    expect(response.status).toBe(200);
    expect(req.session.user).toBeNull();
  });

  test('DELETE /api/users/request/:id - deletes a request', async () => {
    dbUtils.runQuery.mockResolvedValue();

    const response = await request(app).delete('/api/users/request/1');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Request deleted');
  });

  test('PUT /api/users/request/important/:id - marks a request as important', async () => {
    dbUtils.runQuery.mockResolvedValue();

    const response = await request(app).put('/api/users/request/important/1');
    expect(response.status).toBe(200);
    expect(response.text).toContain('Marked as important');
  });
});
