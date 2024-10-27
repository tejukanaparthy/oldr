const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require('path');
const usersRouter = require('./routes/usersRoutes'); // Import user routes

const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your_secret', resave: false, saveUninitialized: true }));
app.use(flash());
app.use(express.static('public')); // Serve static files

// Use user routes
app.use('/', usersRouter); // This should include the login route

app.get('/', (req, res) => {
    res.render('welcome', { title: 'Welcome' }); // Render welcome page
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
