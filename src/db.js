const { Pool } = require('pg');

// Create a connection pool to the PostgreSQL database without username/password
const pool = new Pool({
    host: 'localhost',               // Host name (typically 'localhost')
    database: 'user_management',      // Replace with your database name
    port: 5432,                      // Default PostgreSQL port
});

// Export the pool for use in other files
module.exports = pool;
