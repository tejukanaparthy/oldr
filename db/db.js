const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Adjust the path to your database as necessary
const dbPath = path.join(__dirname, 'database.db');

const db = new sqlite3.Database(dbPath);

module.exports = {
  query: (sql, params) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  },
  close: () => {
    return new Promise((resolve, reject) => {
      db.close(err => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
};
