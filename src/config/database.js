const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db',
  logging: true, // Disable logging; set to true for debugging
});

module.exports = sequelize;
