require("dotenv").config();
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");
const userRoutes = require("./routes/userRoutes"); // Importing your user routes
const app = express();


/**
 * Sets up the Express app with necessary middleware and routes.
 * @function
 * @returns {void}
 */
app.set("view engine", "ejs"); // Set the view engine to EJS
app.set("views", path.join(__dirname, "views")); // Set the views directory
app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory

/**
 * Configures session management with express-session.
 * @function
 * @returns {void}
 */
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret", // Session secret from environment variable or default
    resave: false, // Don't save the session if it hasn't been modified
    saveUninitialized: false, // Don't create a session until something is stored
    cookie: {
      httpOnly: true, // Ensures the cookie is only accessible via HTTP(S)
      secure: process.env.NODE_ENV === "production", // Use secure cookies in production
      maxAge: 60 * 60 * 1000, // Set cookie expiration to 1 hour
    },
  })
);

/**
 * Sets up the flash message middleware for displaying success or error messages.
 * @function
 * @returns {void}
 */
app.use(flash());
app.use((req, res, next) => {
  res.locals.messages = req.flash(); // Expose flash messages to views
  next();
});

/**
 * Mounts user-specific routes at the '/api/users' path.
 * @function
 * @returns {void}
 */
app.use("/api/users", userRoutes);  // Mounting userRoutes at '/api/users'

/**
 * Defines the home route to render the welcome page.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.get("/", (req, res) => {
  res.render("welcome", { title: "Welcome" });
});

/**
 * Handles 404 errors for undefined routes.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {void}
 */
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

/**
 * Starts the server and listens on a specified port.
 */
const PORT = process.env.PORT || 3000;
app.listen(PORT);