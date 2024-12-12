const express = require('express');
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');
const { isAuthenticated, isElderly, isStaff } = require('../middlewares/authMiddleware');

const router = express.Router();

// Render the registration page
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

// Handle user registration
router.post(
  '/register',
  [
    // Validate input fields for registration
    body('firstname').notEmpty().withMessage('First name is required'),
    body('lastname').notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['elderly', 'staff']).withMessage('Role must be either elderly or staff'),
  ],
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', { error: errors.array().map((err) => err.msg).join(', '), success: null });
    }
    next();
  },
  userController.registerUser // Call the controller method to handle registration
);

// Render the login page
router.get('/login', (req, res) => {
  res.render('login', { error: null, success: null });
});

// Handle user login
router.post(
  '/login',
  [
    // Validate login fields
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('login', { error: errors.array().map((err) => err.msg).join(', '), success: null });
    }
    next();
  },
  userController.loginUser // Call the controller method to handle login
);

// Render the welcome page for authenticated users
router.get('/welcome', isAuthenticated, userController.welcomePage);

// Render the elderly page (accessible only to elderly users)
router.get('/elderly', isAuthenticated, isElderly, userController.getElderly);

// Allow elderly users to submit a request
router.post('/requests', isAuthenticated, isElderly, userController.submitRequest);

// Render the staff page (accessible only to staff users)
router.get('/staff', isAuthenticated, isStaff, userController.getStaff);

// Allow staff to delete a request
router.post('/requests/:id/delete', isAuthenticated, isStaff, userController.deleteRequest);

// Allow staff to mark a request as fulfilled
router.post('/requests/:id/fulfill', isAuthenticated, isStaff, userController.fulfillRequest);

// Allow staff to mark a request as important
router.post('/requests/:id/important', isAuthenticated, isStaff, userController.markImportant);

// Get requests submitted by elderly users
router.get('/elderly/requests', isAuthenticated, isElderly, userController.getElderlyRequests);

// Get important requests (staff only)
router.get('/staff/important', isAuthenticated, isStaff, userController.getImportantRequests);

// Get fulfilled requests (staff only)
router.get('/staff/fulfilled', isAuthenticated, isStaff, userController.getFulfilledRequests);

// Logout the user
router.get('/logout', userController.logoutUser);

module.exports = router;
