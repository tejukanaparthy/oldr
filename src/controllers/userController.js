const bcrypt = require('bcryptjs');
const dbUtils = require('../utils/dbUtils');

/**
 * Renders the welcome page.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.welcomePage = (req, res) => {
  res.render('welcome', { user: req.session.user });
};

/**
 * Registers a new user.
 * @param {Object} req - The request object containing user data.
 * @param {Object} res - The response object.
 */
exports.registerUser = async (req, res) => {
  const { firstname, lastname, email, password, role } = req.body;

  try {
    const existingUser = await dbUtils.getAll('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).render('register', { error: 'Email already exists', success: null });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (firstname, lastname, email, password, role) VALUES (?, ?, ?, ?, ?)';
    await dbUtils.runQuery(query, [firstname, lastname, email, hashedPassword, role]);

    res.status(201).render('login', { success: 'Registration successful. Please log in.', error: null });
  } catch {
    res.status(500).render('register', { success: null });
  }
};

/**
 * Logs in a user.
 * @param {Object} req - The request object containing login credentials.
 * @param {Object} res - The response object.
 */
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userResult = await dbUtils.getAll('SELECT * FROM users WHERE email = ?', [email]);
    const user = userResult[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).render('login', { error: 'Invalid email or password', success: null });
    }

    req.session.user = { id: user.id, firstname: user.firstname, lastname: user.lastname, email: user.email, role: user.role };
    res.redirect('/api/users/welcome');
  } catch {
    res.status(500).render('login', { success: null });
  }
};

/**
 * Logs out a user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.logoutUser = (req, res) => {
  req.session.destroy((err) => {
    if (err) res.redirect('/api/users/welcome');
    res.clearCookie('connect.sid');
    res.redirect('/api/users/login');
  });
};

/**
 * Fetches requests for the elderly user.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getElderly = async (req, res) => {
  try {
    const userId = req.session.user.id;
    const query = 'SELECT * FROM requests WHERE user_id = ?';
    const requests = await dbUtils.getAll(query, [userId]);
    res.render('elderly', { user: req.session.user, requests });
  } catch {
    res.status(500).send('An error occurred while fetching your requests.');
  }
};

/**
 * Submits a new request.
 * @param {Object} req - The request object containing request details.
 * @param {Object} res - The response object.
 */
exports.submitRequest = async (req, res) => {
  const { description } = req.body;
  const userId = req.session.user.id;

  try {
    const query = 'INSERT INTO requests (user_id, description, status, priority) VALUES (?, ?, "pending", false)';
    await dbUtils.runQuery(query, [userId, description]);
    res.redirect('/api/users/elderly');
  } catch {
    res.status(500).send('An error occurred while submitting your request.');
  }
};

/**
 * Fetches all requests made by elderly users.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getElderlyRequests = async (req, res) => {
  try {
    const query = `
      SELECT requests.id, requests.description, requests.status, requests.priority, users.firstname, users.lastname
      FROM requests
      JOIN users ON requests.user_id = users.id
      WHERE users.role = 'elderly' AND requests.user_id = ?
      ORDER BY requests.created_at ASC
    `;
    const elderlyRequests = await dbUtils.getAll(query, [req.session.user.id]);
    res.render('elderly/requests', { user: req.session.user, elderlyRequests });
  } catch {
    res.status(500).send('An error occurred while fetching elderly requests.');
  }
};

/**
 * Fetches all requests for staff.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getStaff = async (req, res) => {
  try {
    const query = `
      SELECT requests.id, requests.description, requests.status, requests.priority, users.firstname, users.lastname
      FROM requests
      JOIN users ON requests.user_id = users.id
      ORDER BY requests.status DESC, requests.priority DESC, requests.created_at ASC
    `;
    const requests = await dbUtils.getAll(query);
    res.render('staff', { user: req.session.user, requests });
  } catch {
    res.status(500).send('An error occurred while fetching requests.');
  }
};

/**
 * Deletes a request.
 * @param {Object} req - The request object containing request ID in params.
 * @param {Object} res - The response object.
 */
exports.deleteRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'DELETE FROM requests WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch {
    res.status(500).send('An error occurred while deleting the request.');
  }
};

/**
 * Marks a request as fulfilled.
 * @param {Object} req - The request object containing request ID in params.
 * @param {Object} res - The response object.
 */
exports.fulfillRequest = async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'UPDATE requests SET status = "fulfilled" WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch {
    res.status(500).send('An error occurred while fulfilling the request.');
  }
};

/**
 * Marks a request as important.
 * @param {Object} req - The request object containing request ID in params.
 * @param {Object} res - The response object.
 */
exports.markImportant = async (req, res) => {
  const requestId = req.params.id;

  try {
    const query = 'UPDATE requests SET priority = true WHERE id = ?';
    await dbUtils.runQuery(query, [requestId]);
    res.redirect('/api/users/staff');
  } catch {
    res.status(500).send('An error occurred while marking the request as important.');
  }
};

/**
 * Fetches all important requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getImportantRequests = async (req, res) => {
  try {
    const query = `
      SELECT requests.id, requests.description, requests.status, requests.priority, 
             users.firstname, users.lastname 
      FROM requests 
      JOIN users ON requests.user_id = users.id 
      WHERE requests.priority = 1
      ORDER BY requests.created_at ASC
    `;
    const requests = await dbUtils.getAll(query);
    res.render('staff/important', { user: req.session.user, requests });
  } catch {
    res.status(500).send('An error occurred while fetching important requests.');
  }
};

/**
 * Fetches all fulfilled requests.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
exports.getFulfilledRequests = async (req, res) => {
  try {
    const query = `
      SELECT requests.id, requests.description, requests.status, requests.priority, 
             users.firstname, users.lastname 
      FROM requests 
      JOIN users ON requests.user_id = users.id 
      WHERE requests.status = 'fulfilled'
      ORDER BY requests.created_at ASC
    `;
    const requests = await dbUtils.getAll(query);
    res.render('staff/fulfilled', { user: req.session.user, requests });
  } catch {
    res.status(500).send('An error occurred while fetching fulfilled requests.');
  }
};
