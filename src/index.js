const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configure session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'default_secret', // Use a strong secret in production
    resave: false,
    saveUninitialized: false,
  })
);

// Make user data available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

// Routes
app.use('/api/users', userRoutes);

// Serve static files (optional, for CSS/JS if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Home route (redirect to login)
app.get('/', (req, res) => {
  res.redirect('/api/users/login');
});

// Start the server and synchronize the database
app.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  try {
    await sequelize.sync(); // Removed { force: true } to prevent data loss
    console.log('Database synchronized');
  } catch (error) {
    console.error('Unable to synchronize the database:', error);
  }
});
