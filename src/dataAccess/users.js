const bcrypt = require("bcryptjs");
const pool = require("../../db/db"); // Import your existing db connection

class User {
    /**
     * Check if the email already exists in the database.
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} - Resolves to `true` if email exists, `false` otherwise.
     */
    static async emailExists(email) {
        const res = await this._checkEmailExistence(email);
        return res.rowCount > 0;
    }

    /**
     * Register a new user by validating and hashing their password.
     * @param {string} firstname - The first name of the user.
     * @param {string} lastname - The last name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password for the user (will be hashed).
     * @returns {Promise<number>} - Resolves to the new user ID.
     */
    static async register(firstname, lastname, email, password) {
        const hashedPassword = this._hashPassword(password); // Use private method for hashing
        const res = await this._registerUser(firstname, lastname, email, hashedPassword);
        return res; // Return the new user ID
    }

    /**
     * Get a user by their username (email).
     * @param {string} username - The email of the user.
     * @returns {Promise<Object|null>} - Resolves to the user object if found, `null` otherwise.
     */
    static async getByUName(username) {
        const user = await this._fetchUserByEmail(username);
        return user || null; // Return the user object or null if not found
    }

    /**
     * Authenticate a user by their email and password.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password to verify.
     * @returns {Promise<Object|null>} - Resolves to the user object if authentication is successful, `null` otherwise.
     */
    static async getByAuth(email, password) {
        const user = await this.getByUName(email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user; // Successful authentication
        }
        return null; // Authentication failed
    }

    /**
     * Private method to check if an email exists in the database.
     * @param {string} email - The email to check.
     * @returns {Promise<Object>} - Resolves to the query result object.
     * @private
     */
    static async _checkEmailExistence(email) {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return res; // Returning the result for use in the public methods
    }

    /**
     * Private method to hash the password using bcrypt.
     * @param {string} password - The password to hash.
     * @returns {string} - The hashed password.
     * @private
     */
    static _hashPassword(password) {
        return bcrypt.hashSync(password, 8); // Hashing password
    }

    /**
     * Private method to register a user in the database.
     * @param {string} firstname - The first name of the user.
     * @param {string} lastname - The last name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} hashedPassword - The hashed password for the user.
     * @returns {Promise<number>} - Resolves to the new user ID.
     * @private
     */
    static async _registerUser(firstname, lastname, email, hashedPassword) {
        const res = await pool.query(
            "INSERT INTO users (firstname, lastname, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
            [firstname, lastname, email, hashedPassword]
        );
        return res.rows[0].id; // Return the new user ID
    }

    /**
     * Private method to fetch a user by their email from the database.
     * @param {string} email - The email address of the user.
     * @returns {Promise<Object|null>} - Resolves to the user object if found, `null` otherwise.
     * @private
     */
    static async _fetchUserByEmail(email) {
        const res = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        return res.rows[0]; // Return the user object or null if not found
    }
}

module.exports = User;
