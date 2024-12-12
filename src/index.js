const express = require("express");
const bodyParser = require("body-parser");
const session = require("express-session");
const userRoutes = require("./routes/userRoutes");
const path = require("path");
const dotenv = require("dotenv");
// const dbUtils = require("./utils/dbUtils"); 

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

/**
 * Sets up the templating engine to use EJS for rendering views.
 * @function
 * @returns {void}
 */
app.set("view engine", "ejs"); // Set EJS as the templating engine
app.set("views", path.join(__dirname, "views")); // Specify the views directory

/**
 * Middleware to parse URL-encoded and JSON request bodies.
 * @function
 * @returns {void}
 */
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON data

/**
 * Configures session middleware for session management.
 * @function
 * @returns {void}
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Session secret from environment variable or default
    resave: false, // Don't save the session if it hasn't been modified
    saveUninitialized: false, // Don't create a session until something is stored
  })
);

/**
 * Makes user data available in all views by attaching it to res.locals.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 * @returns {void}
 */
app.use((req, res, next) => {
  res.locals.user = req.session.user; // Attach user data from the session to res.locals
  next(); // Move to the next middleware or route handler
});

// Routes
app.use("/api/users", userRoutes); // Mount user routes at '/api/users'

/**
 * Serves static files (e.g., images, CSS, JavaScript).
 * @function
 * @returns {void}
 */
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory

/**
 * Home route, redirects the user to the login page.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/", (req, res) => {
  res.redirect("/api/users/login"); // Redirect to the login page
});
app.listen(PORT);
