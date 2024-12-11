const bcrypt = require('bcryptjs');
const dbUtils = require('../utils/dbUtils');

/**
 * Renders the welcome page for the authenticated user.
 */
exports.welcomePage = (req, res) => {
  res.render('welcome', { user: req.session.user });
};

/**
 * Handles user registration by validating input, hashing the password,
 * and inserting the new user into the database.
 */
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    // Check if the user already exists in the database
    const existingUser = await dbUtils.getAll('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      console.log(`Email already exists: ${email}`);
      return res.status(400).render('register', { error: 'Email already exists', success: null });
    }

    // Hash the user's password for secure storage
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Hashed password generated:', hashedPassword);

    // SQL query to insert the new user into the 'users' table
    const query = `
      INSERT INTO users (firstname, lastname, email, password, role) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const result = await dbUtils.runQuery(query, [firstname, lastname, email, hashedPassword, role]);
    console.log('User created successfully:', { id: result.lastID, firstname, lastname, email, role });

    // Redirect to the login page with a success message
    res.status(201).render('login', { success: 'Registration successful. Please log in.', error: null });
  } catch (error) {
    console.error('Error during user registration:', error.message);
    res.status(500).render('register', { error: 'Server error', success: null });
  }
};

/**
 * Handles user login by validating credentials and establishing a session.
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user from the database based on the provided email
    const userResult = await dbUtils.getAll('SELECT * FROM users WHERE email = ?', [email]);
    const user = userResult[0];

    console.log('User retrieved from DB:', user); // Debug log

    if (!user) {
      console.log(`User not found for email: ${email}`);
      return res.status(400).render('login', { error: 'Invalid email or password', success: null });
    }

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match result:', isMatch);

    if (!isMatch) {
      return res.status(400).render('login', { error: 'Invalid email or password', success: null });
    }

    // Save user information in the session
    req.session.user = {
      id: user.id, // Ensure the user's ID is saved in the session
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    };
    console.log('User session saved:', req.session.user); // Debug log

    // Redirect to the welcome page after successful login
    res.redirect('/api/users/welcome');
  } catch (error) {
    console.error('Error during user login:', error.message);
    res.status(500).render('login', { error: 'Server error', success: null });
  }
};

/**
 * Handles user logout by destroying the session and clearing cookies.
 */
exports.logoutUser = (req, res) => {
  console.log('Logging out user:', req.session.user);
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/api/users/welcome');
    }
    res.clearCookie('connect.sid'); // Clear the session cookie
    res.redirect('/api/users/login'); // Redirect to the login page
  });
};

/**
 * Handles the submission of user requests by inserting them into the database.
 */
exports.submitRequest = async (req, res) => {
  const { description } = req.body;
  const userId = req.session.user?.id; // Ensure user ID is retrieved from the session

  try {
    console.log('User ID from session:', userId); // Debug log

    if (!userId) {
      console.error('Error: userId is null during request submission.');
      return res.status(400).send('Invalid session data.');
    }

    // SQL query to insert a new request into the 'requests' table
    const query = `INSERT INTO requests (user_id, description, status, priority) VALUES (?, ?, 'pending', false)`;
    await dbUtils.runQuery(query, [userId, description]);
    console.log(`Request submitted successfully for user_id ${userId}`);

    // Redirect back to the elderly user's dashboard after submission
    res.redirect('/api/users/elderly');
  } catch (error) {
    console.error('Error submitting request:', error.message);
    res.status(500).send('An error occurred while submitting your request.');
  }
};
