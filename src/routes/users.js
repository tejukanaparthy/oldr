const bcrypt = require('bcryptjs');
const db = require('../config/database'); // Adjust the path as necessary
module.exports = User;

class User {
    static emailExists(email) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT COUNT(*) AS count FROM users WHERE email = ?';
            db.get(query, [email], (err, row) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(row.count > 0);
                }
            });
        });
    }

    static register(firstname, lastname, email, password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        return new Promise((resolve, reject) => {
            const query = 'INSERT INTO users (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
            db.run(query, [firstname, lastname, email, hashedPassword], function (err) {
                if (err) {
                    reject(err);
                } else {
                    resolve(true);
                }
            });
        });
    }

    static getByAuth(email, password) {
        return new Promise((resolve, reject) => {
            const query = 'SELECT * FROM users WHERE email = ?';
            db.get(query, [email], (err, user) => {
                if (err) {
                    reject(err);
                } else if (user && bcrypt.compareSync(password, user.password)) {
                    resolve(user);
                } else {
                    resolve(null);
                }
            });
        });
    }
}


