/**
 * Represents a user in the database.
 * @typedef {Object} User
 * @property {string} firstname - The user's first name.
 * @property {string} lastname - The user's last name.
 * @property {string} email - The user's email address.
 * @property {string} password - The user's password.
 * @property {string} role - The user's role (e.g., admin, user).
 */

/**
 * User model representing the 'User' table in the database.
 * @module models/User
 */

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * User model definition.
 * @type {Model}
 */
const User = sequelize.define('User', {
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
