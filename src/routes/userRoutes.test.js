const request = require('supertest');
const express = require('express');
const session = require('express-session');
const userRoutes = require('./userRoutes'); // Adjust the path as necessary
const userController = require('../controllers/userController');
const { isAuthenticated, isElderly, isStaff } = require('../middlewares/authMiddleware');

const app = express();

// Middleware setup for testing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: 'test-secret', resave: false, saveUninitialized: true }));
app.set('view engine', 'ejs'); // or whatever engine you're using
app.set('views', './views'); 

let sessionUser;
app.use((req, res, next) => {
  req.session = { user: sessionUser };
  next();
});

// Mock render to prevent actual view rendering during tests
app.use((req, res, next) => {
  res.render = jest.fn().mockImplementation((view, options) => {
    res.send(`Rendered ${view}`);
  });
  next();
});

app.use('/api/users', userRoutes);

// Mock the userController methods
jest.mock('../controllers/userController');

// Tests
describe('User Routes Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    sessionUser = null;
  });

  test('GET /api/users/register - should render registration page', async () => {
    const response = await request(app).get('/api/users/register');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Rendered register');
  });

  test('POST /api/users/register - should register a new user successfully', async () => {
    userController.registerUser.mockImplementation((req, res) => {
      res.status(201).send('Registration successful.');
    });

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
    expect(response.text).toBe('Registration successful.');
  });

  test('POST /api/users/register - should return validation errors', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({
        firstname: '',
        lastname: '',
        email: 'invalid-email',
        password: '123',
        role: 'unknown',
      });

    expect(response.status).toBe(400);
    expect(response.text).toContain('Validation errors');
  });

  test('GET /api/users/login - should render login page', async () => {
    const response = await request(app).get('/api/users/login');
    expect(response.status).toBe(200);
    expect(response.text).toBe('Rendered login');
  });

  test('POST /api/users/login - should log in a user successfully', async () => {
    userController.loginUser.mockImplementation((req, res) => {
      req.session.user = { email: 'jane@example.com' };
      res.redirect('/api/users/welcome');
    });

    const response = await request(app)
      .post('/api/users/login')
      .send({
        email: 'jane@example.com',
        password: 'Password123!',
      });

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/api/users/welcome');
  });

  test('GET /api/users/welcome - should render welcome page for authenticated users', async () => {
    sessionUser = { id: 1, email: 'test@example.com', role: 'elderly' };
    userController.welcomePage.mockImplementation((req, res) => {
      res.status(200).send('Welcome!');
    });

    const response = await request(app).get('/api/users/welcome');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Welcome!');
  });

  test('GET /api/users/elderly - should allow access to elderly users', async () => {
    sessionUser = { id: 1, email: 'test@example.com', role: 'elderly' };
    userController.getElderly.mockImplementation((req, res) => {
      res.status(200).send('Elderly page accessed');
    });

    const response = await request(app).get('/api/users/elderly');

    expect(response.status).toBe(200);
    expect(response.text).toBe('Elderly page accessed');
  });

  test('GET /api/users/logout - should log out a user successfully', async () => {
    userController.logoutUser.mockImplementation((req, res) => {
      req.session.destroy();
      res.redirect('/api/users/login');
    });

    const response = await request(app).get('/api/users/logout');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/api/users/login');
  });
});
