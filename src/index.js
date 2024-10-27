const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const usersRouter = require('./routes/usersRoutes'); // Ensure this path is correct

const app = express();
const PORT = process.env.PORT || 8080;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Set the views directory

// Middleware
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies
app.use(express.static('public')); // Serve static files

// Set up session middleware
app.use(session({
    secret: 'your_secret', // Replace with a strong secret
    resave: false,
    saveUninitialized: true
}));

// Initialize connect-flash
app.use(flash());

// Define the home route
app.get('/', (req, res) => {
    res.send('Welcome to the homepage!'); // You can render a view instead
});

// Use user routes
app.use('/', usersRouter);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
