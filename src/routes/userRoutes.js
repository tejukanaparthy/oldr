const express = require('express');
const { registerUser } = require('../controllers/userController');

const router = express.Router();

// GET registration form
router.get('/register', (req, res) => {
  res.render('register', { error: null, success: null });
});

// POST registration form
router.post('/register', registerUser);

module.exports = router;
