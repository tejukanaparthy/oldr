const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Defines the 'User' model using Sequelize ORM.
 * This model maps to the 'users' table in the SQLite database.
 */
const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false, // First name is required
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false, // Last name is required
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false, // Email is required
    unique: true, // Email must be unique
    validate: {
      isEmail: true, // Validates the format of the email
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false, // Password is required
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false, // Role is required (e.g., elderly, staff)
  },
});

module.exports = User;


