const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const pool = new Pool({
    user: 'your_db_user',      // Replace with your database username
    host: 'localhost',          // Database host
    database: 'user_management', // Database name
    password: 'your_db_password', // Replace with your database password
    port: 5432,                 // Default PostgreSQL port
});

// Function to run SQL files
const runSQLFile = async (filePath) => {
    const sql = fs.readFileSync(filePath, 'utf8');
    try {
        await pool.query(sql);
        console.log(`Successfully executed ${filePath}`);
    } catch (error) {
        console.error(`Error executing ${filePath}:`, error.message);
    }
};

// Initialize the database
const initDatabase = async () => {
    await runSQLFile(path.join(__dirname, '../db/create.sql'));
    await runSQLFile(path.join(__dirname, '../db/load.sql')); // Uncomment if you have this file
    pool.end();
};

initDatabase();
