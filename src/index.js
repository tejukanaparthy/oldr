const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const sequelize = require('./config/database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Routes
app.use('/api/users', userRoutes);

// Serve static files (optional, for CSS/JS if needed)
app.use(express.static(path.join(__dirname, 'public')));

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
