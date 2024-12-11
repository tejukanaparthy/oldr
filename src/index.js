const express = require('express');
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const path = require('path');
const dotenv = require('dotenv');
const dbUtils = require('./utils/dbUtils'); // Ensure consistent db connection

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define the views directory

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Secret for signing the session ID cookie
    resave: false, // Don't save session if unmodified
    saveUninitialized: false, // Don't create session until something stored
  })
);

// Make user data available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user; // Attach user data to response locals
  next();
});

// Define application routes
app.use('/api/users', userRoutes); // Use user routes for all paths under /api/users

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets

// Home route (redirect to login)
app.get('/', (req, res) => {
  res.redirect('/api/users/login'); // Redirect to the login page
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
