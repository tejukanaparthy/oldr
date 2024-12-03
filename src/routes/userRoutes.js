const express = require('express');
const { registerUser, loginUser, welcomePage, logoutUser } = require('../controllers/userController');
const { body, validationResult } = require('express-validator');

const router = express.Router();

// Middleware to check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.session.user && req.session.user.email) {
    next();
  } else {
    res.redirect('/api/users/login');
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
    body('role').isIn(['user', 'admin']).withMessage('Role must be either user or admin'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(err => err.msg).join(', ');
      return res.status(400).render('register', { error: errorMessages, success: null });
    }
    next();
  },
  registerUser
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
      const errorMessages = errors.array().map(err => err.msg).join(', ');
      return res.status(400).render('login', { error: errorMessages, success: null });
    }
    next();
  },
  loginUser
);

// GET welcome page (protected)
router.get('/welcome', isAuthenticated, welcomePage);

// GET logout
router.get('/logout', logoutUser);

module.exports = router;
