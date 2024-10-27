const bcrypt = require('bcryptjs');
const pool = require('../db'); // Ensure this path is correct

class User {
    static async emailExists(email) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        return res.rowCount > 0; // Return true if email exists
    }

    static async register(firstname, lastname, email, password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        await pool.query(
            'INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4)',
            [firstname, lastname, email, hashedPassword]
        );
        return true; // Optionally return the new user object
    }

    static async getByAuth(email, password) {
        const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = res.rows[0];

        if (user && bcrypt.compareSync(password, user.password)) {
            return user; // Return user if email matches and password is correct
        }
        return null; // user not found or password incorrect
    }
}

module.exports = User;

