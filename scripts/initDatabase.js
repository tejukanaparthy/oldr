const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const initDatabase = () => {
    const dbPath = path.join(__dirname, '../db/database.db');
    const db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
            console.error('Error opening database:', err.message);
        } else {
            console.log('Connected to the SQLite database at:', dbPath);

            // Create 'users' table
            db.run(
                `CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    firstname TEXT NOT NULL,
                    lastname TEXT NOT NULL,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL
                )`,
                (err) => {
                    if (err) {
                        console.error('Error creating users table:', err.message);
                    } else {
                        console.log('Users table created or already exists.');
                    }
                }
            );

            // Create 'requests' table
            db.run(
                `CREATE TABLE IF NOT EXISTS requests (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    description TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'pending',
                    priority BOOLEAN NOT NULL DEFAULT false,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (user_id) REFERENCES users (id)
                )`,
                (err) => {
                    if (err) {
                        console.error('Error creating requests table:', err.message);
                    } else {
                        console.log('Requests table created or already exists.');
                    }
                }
            );
        }
    });

    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};

module.exports = initDatabase;

