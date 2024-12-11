/* eslint-disable no-console */
/* eslint-disable consistent-return */

const express = require('express');
const { registerUser, loginUser, welcomePage, logoutUser } = require('../controllers/userController');
const dbUtils = require('../utils/dbUtils');
const { body, validationResult } = require('express-validator');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management and authentication
 */

/**
 * @swagger
 * /api/users/register:
 *   get:
 *     summary: Get the registration form
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Registration form rendered
 */

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.email) {
    next();
  } else {
    res.redirect('/api/users/login');
  }
};

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [elderly, staff]
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input
 */

// Middleware to check if the user is elderly
const isElderly = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'elderly') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
};

/**
 * @swagger
 * /api/users/login:
 *   get:
 *     summary: Get the login form
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Login form rendered
 */

// Middleware to check if the user is staff
const isStaff = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'staff') {
    next();
  } else {
    res.status(403).send('Access Denied');
  }
};

// GET registration form
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

// POST registration form with validation
router.post(
  '/register',
  [
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['elderly', 'staff']).withMessage('Role must be either elderly or staff'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg).join(', ');
      return res.status(400).render('register', { error: errorMessages, success: null });
    }
    next();
  },
  registerUser,
);

// GET login form
router.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});

// POST login form with validation
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg).join(', ');
      return res.status(400).render('login', { error: errorMessages, success: null });
    }
    next();
  },
  loginUser,
);

/**
 * @swagger
 * /api/users/elderly:
 *   get:
 *     summary: Get elderly page
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Elderly page fetched
 *       403:
 *         description: Access denied
 */

// GET elderly page
router.get('/elderly', isAuthenticated, isElderly, async (req, res) => {
  try {
    const userId = req.session.user.id;
    const query = 'SELECT * FROM requests WHERE user_id = ?';
    const requests = await dbUtils.getAll(query, [userId]);
    res.render('elderly', { user: req.session.user, requests });
  } catch (error) {
    console.error('Error fetching requests:', error.message);
    res.status(500).send('An error occurred while fetching your requests.');
  }
});

// POST submit request
router.post('/requests', isAuthenticated, isElderly, async (req, res) => {
  const { description } = req.body;
  const userId = req.session.user.id;

  try {
    const query = 'INSERT INTO requests (user_id, description, status, priority) VALUES (?, ?, "pending", false)';
    await dbUtils.runQuery(query, [userId, description]);
    res.redirect('/api/users/elderly');
  } catch (error) {
    console.error('Error submitting request:', error.message);
    res.status(500).send('An error occurred while submitting your request.');
  }
});

// GET staff page
router.get('/staff', isAuthenticated, isStaff, async (req, res) => {
  try {
    const query = `
      SELECT requests.id, requests.description, requests.status, requests.priority, users.firstname, users.lastname
      FROM requests
      JOIN users ON requests.user_id = users.id
      ORDER BY requests.status DESC, requests.priority DESC, requests.created_at ASC
    `;
    const requests = await dbUtils.getAll(query);
    res.render('staff', { user: req.session.user, requests });
  } catch (error) {
    console.error('Error fetching requests for staff:', error.message);
    res.status(500).send('An error occurred while fetching requests.');
  }
});

// POST delete a request
router.post('/requests/:id/delete', isAuthenticated, isStaff, async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'DELETE FROM requests WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch (error) {
    console.error('Error deleting request:', error.message);
    res.status(500).send('An error occurred while deleting the request.');
  }
});

// POST mark a request as fulfilled
router.post('/requests/:id/fulfill', isAuthenticated, isStaff, async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'UPDATE requests SET status = "fulfilled" WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch (error) {
    console.error('Error fulfilling request:', error.message);
    res.status(500).send('An error occurred while fulfilling the request.');
  }
});

// POST mark a request as important
router.post('/requests/:id/important', isAuthenticated, isStaff, async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'UPDATE requests SET priority = true WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch (error) {
    console.error('Error marking request as important:', error.message);
    res.status(500).send('An error occurred while marking the request as important.');
  }
});

// GET welcome page (protected)
router.get('/welcome', isAuthenticated, welcomePage);

// GET logout
router.get('/logout', logoutUser);

module.exports = router;
