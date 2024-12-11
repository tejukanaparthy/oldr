// Import the database connection utility
const db = require('../db'); // Adjust the path as necessary

/**
 * Initializes the SQLite database by creating necessary tables.
 * This function creates the 'users' table if it doesn't already exist.
 */
const initDatabase = () => {
    // Serialize ensures that the queries run sequentially
    db.serialize(() => {
        // SQL query to create the 'users' table with necessary fields
        const createUsersTable = `
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                firstname TEXT NOT NULL,
                lastname TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                password TEXT NOT NULL
            );
        `;
        // Execute the table creation query
        db.run(createUsersTable, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                console.log('Users table created or already exists.');
            }
        });
    });

    // Close the database connection after initialization
    db.close((err) => {
        if (err) {
            console.error('Error closing the database connection:', err.message);
        } else {
            console.log('Database connection closed.');
        }
    });
};

// Execute the database initialization
initDatabase();


