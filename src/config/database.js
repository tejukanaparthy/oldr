const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Initializes Sequelize with SQLite as the database dialect.
 * The storage option specifies the path to the SQLite database file.
 */
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.db', // Path to your SQLite database file
  logging: false, // Disable logging; set to true for debugging purposes
});

module.exports = sequelize;
