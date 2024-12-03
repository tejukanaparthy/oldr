const bcrypt = require('bcryptjs');
const User = require('../models/user');

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

    res.status(201).render('register', { success: 'User registered successfully', error: null });
  } catch (error) {
    res.status(500).render('register', { error: 'Server error', success: null });
  }
};
