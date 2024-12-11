require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const userRoutes = require('./routes/userRoutes');

const app = express();

// Initialize SQLite database connection
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Middleware setup
app.set('view engine', 'ejs'); // Set EJS as the templating engine
app.set('views', path.join(__dirname, 'views')); // Define the views directory
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Secret for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
    cookie: {
      httpOnly: true, // Mitigate XSS attacks by preventing client-side scripts from accessing the cookie
      secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // 1 hour in milliseconds
    },
  })
);

// Flash messages setup
app.use(flash()); // Initialize flash messaging
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Make flash messages available in all views
  next();
});

// Define application routes
app.use('/api/users', userRoutes); // Use user routes for all paths under /api/users

// Home route
app.get('/', (req, res) => {
  res.render('welcome', { title: 'Welcome' }); // Render the welcome page
});

// Start the server
const PORT = process.env.PORT || 8080; // Define the port to listen on
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
