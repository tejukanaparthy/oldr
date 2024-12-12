const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../db/database.db');

const db = new sqlite3.Database(dbPath);

/**
 * Executes a query on the SQLite database.
 * @param {string} query - The SQL query to be executed.
 * @param {Array} [params=[]] - The parameters to bind to the query.
 * @returns {Promise<sqlite3.RunResult>} Resolves with the result of the query.
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
 * Fetches all rows from the SQLite database that match the query.
 * @param {string} query - The SQL query to retrieve rows.
 * @param {Array} [params=[]] - The parameters to bind to the query.
 * @returns {Promise<Object[]>} Resolves with an array of rows returned by the query.
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
