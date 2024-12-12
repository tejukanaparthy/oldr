const bcrypt = require("bcryptjs");
const db = require("../config/database"); // Adjust the path as necessary



class User {
    /**
     * Check if the email already exists in the database.
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} - Resolves to `true` if email exists, `false` otherwise.
     */
    static emailExists(email) {
        return new Promise((resolve, reject) => {
            this._checkEmailExistence(email)
                .then(resolve)
                .catch(reject);
        });
    }

    /**
     * Register a new user by first validating and hashing their password.
     * @param {string} firstname - The first name of the user.
     * @param {string} lastname - The last name of the user.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password for the user (will be hashed).
     * @returns {Promise<boolean>} - Resolves to `true` if registration succeeds.
     * @throws {Error} If email is invalid or registration fails.
     */
    static register(firstname, lastname, email, password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)";
            db.run(query, [firstname, lastname, email, hashedPassword], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * Authenticate a user by checking their email and password.
     * @param {string} email - The email address of the user.
     * @param {string} password - The password to verify.
     * @returns {Promise<Object|null>} - Resolves to the user object if credentials are valid, `null` otherwise.
     */
    static getByAuth(email, password) {
        return new Promise((resolve, reject) => {
            this._fetchUserByEmail(email)
                .then(user => {
                    if (user && bcrypt.compareSync(password, user.password)) {
                        resolve(user);
                    } else {
                        resolve(null);
                    }
                })
                .catch(reject);
        });
    }

    /**
     * Private method to check if an email already exists in the database.
     * @param {string} email - The email to check.
     * @returns {Promise<boolean>} - Resolves to `true` if email exists, `false` otherwise.
     * @private
     */
    static _checkEmailExistence(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT COUNT(*) AS count FROM users WHERE email = ?";
            db.get(query, [email], (err, row) => {
                if (err) {
                    console.error(`Error checking email existence: ${err.message}`);
                    reject(new Error("Error checking email existence."));
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    /**
     * Private method to fetch a user by their email.
     * @param {string} email - The email address of the user.
     * @returns {Promise<Object|null>} - Resolves to the user object if found, `null` otherwise.
     * @private
     */
    static _fetchUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users WHERE email = ?";
            db.get(query, [email], (err, user) => {
                if (err) {
                    console.error(`Error fetching user: ${err.message}`);
                    reject(new Error("Authentication failed"));
                } else {
                    resolve(user);
                }
            });
        });
    }
}

module.exports = User;