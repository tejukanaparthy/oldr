const bcrypt = require('bcryptjs');
const pool = require('../db'); // Import your existing db connection

class User {
    static async emailExists(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rowCount > 0;
    }

    static async register(firstname, lastname, email, password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        const res = await pool.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id',
            [firstname, lastname, email, hashedPassword]
        );
        return res.rows[0].id; // Return the new user ID
    }

    static async getByUName(username) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [username]);
        return res.rows[0]; // Return the user object
    }

    static async getByAuth(email, password) {
        const user = await this.getByUName(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user; // Successful authentication
        }
        return null; // Authentication failed
    }
}

module.exports = User;

