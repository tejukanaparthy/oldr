require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const bodyParser = require('body-parser'); // Middleware for parsing request bodies
const swaggerUi = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const initDatabase = require('../scripts/initDatabase'); // Ensure this path is correct
const userRoutes = require('./routes/userRoutes');

// Initialize the app
const app = express();
const PORT = process.env.PORT || 3000;

// Debug: Log database initialization
console.log('Initializing database...');
initDatabase();
console.log('Database initialized.');

// Swagger setup
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'User Management API',
      version: '1.0.0',
      description: 'API for user management and authentication',
      contact: {
        name: 'Camden Chin',
        email: 'camden.chin@example.com',
      },
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
      },
    ],
  },
  apis: ['./src/routes/userRoutes.js'], // Adjust this path based on your project structure
};

// Generate Swagger docs
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Debug: Print the generated Swagger docs to console
console.log('Generated Swagger Docs:', JSON.stringify(swaggerDocs, null, 2));

// Set up Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
console.log('Swagger UI available at /api-docs');

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views')); // Define the views directory

// Middleware for parsing request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies
console.log('Body parsers set up.');

// Serve static files
app.use(express.static(path.join(__dirname, 'public'))); // Serve static assets
console.log('Static files served from public directory.');

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
console.log('Session middleware configured.');

// Flash messages setup
app.use(flash()); // Initialize flash messaging
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Make flash messages available in all views
  next();
});
console.log('Flash messages middleware set up.');

// Make user data available in all views
app.use((req, res, next) => {
  console.log('Session user:', req.session.user); // Debug: Log user session data
  res.locals.user = req.session.user || null; // Ensure user is always defined
  next();
});

// Define application routes
app.use('/api/users', userRoutes); // Use user routes for all paths under /api/users
console.log('Routes set up for /api/users');

// Home route - Redirect to login
app.get('/', (req, res) => {
  console.log('Home route accessed - redirecting to login'); // Debug: Log home route access
  res.redirect('/api/users/login'); // Redirect to login page
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Swagger API documentation available at http://localhost:${PORT}/api-docs`);
});
