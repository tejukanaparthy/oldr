const bcrypt = require('bcryptjs');
const User = require('../models/user');

// Render the welcome page
exports.welcomePage = (req, res) => {
  res.render('welcome', { user: req.session.user });
};

// Handle user registration
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).render('register', { error: 'Email already exists', success: null });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the user
    const user = await User.create({
      firstname,
      lastname,
      email,
      password: hashedPassword,
      role,
    });

    // Redirect to login page with success message
    res.status(201).render('login', { success: 'Registration successful. Please log in.', error: null });
  } catch (error) {
    res.status(500).render('register', { error: 'Server error', success: null });
  }
};

// Handle user login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(400).render('login', { error: 'Invalid email or password', success: null });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).render('login', { error: 'Invalid email or password', success: null });
    }

    // Save user info in session
    req.session.user = {
      id: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };

    // Redirect to welcome page
    res.redirect('/api/users/welcome');
  } catch (error) {
    res.status(500).render('login', { error: 'Server error', success: null });
  }
};

// Handle user logout
exports.logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.redirect('/api/users/welcome');
    }
    res.clearCookie('connect.sid');
    res.redirect('/api/users/login');
  });
};
