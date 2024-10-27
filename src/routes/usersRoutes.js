const express = require('express');  // Import express
const { body, validationResult } = require('express-validator');
const User = require('../dataAccess/users'); // Ensure this path is correct

const router = express.Router();  // Initialize the router

// Login route
router.get('/login', (req, res) => {
    res.render('login', { title: 'Login', messages: req.flash('error') });
});

// Registration route
router.get('/register', (req, res) => {
    res.render('register', { title: 'Register', messages: req.flash('error') });
});

// Login route (POST)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      const user = await User.getByAuth(email, password);
      if (!user) {
          req.flash('error', 'Invalid email or password');
          return res.redirect('/login'); // Redirect back to login with error
      }

      req.session.user = user; // Store user info in session
      return res.redirect('/'); // Redirect to home page after successful login
  } catch (error) {
      console.error('Login error:', error.message);
      return res.status(500).json({ error: 'Server error during login' });
  }
});

// Handle registration form submission
router.post('/register', [
    body('firstname').notEmpty().withMessage('First name is required.'),
    body('lastname').notEmpty().withMessage('Last name is required.'),
    body('email').isEmail().withMessage('Valid email is required.'),
    body('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long.'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('error', errors.array().map(err => err.msg));
        return res.redirect('/register'); // Redirect back to the form with errors
    }

    const { firstname, lastname, email, password } = req.body;

    if (await User.emailExists(email)) {
        req.flash('error', 'Email already in use');
        return res.redirect('/register'); // Redirect back to the form
    }

    try {
        await User.register(firstname, lastname, email, password); // Await the registration
        res.redirect('/login'); // Redirect to login after successful registration
    } catch (error) {
        console.error('Registration error:', error.message);
        req.flash('error', 'Server error during registration');
        return res.redirect('/register'); // Redirect back to the form
    }
});

// Export the router
module.exports = router;


