const sqlite3 = require('sqlite3').verbose();
const path = require('path');

/**
 * Constructs the absolute path to the SQLite database file.
 * Adjust the path according to your project structure.
 */
const dbPath = path.join(__dirname, '../../db/database.db'); // Ensure this points to db/database.db
console.log('Using database file at:', dbPath); // Debug log

// Initialize the SQLite database connection
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error connecting to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
  }
});

/**
 * Executes a run query (INSERT, UPDATE, DELETE) and returns the result.
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters for the SQL query.
 * @returns {Promise<Object>} - Resolves with the statement context.
 */
const runQuery = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(query, params, function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(this); // 'this' contains the last inserted ID and other metadata
      }
    });
  });
};

/**
 * Executes a SELECT query and returns all matching rows.
 * @param {string} query - The SQL query to execute.
 * @param {Array} params - The parameters for the SQL query.
 * @returns {Promise<Array>} - Resolves with an array of rows.
 */
const getAll = (query, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
};

module.exports = {
  runQuery,
  getAll,
};
