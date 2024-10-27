const bcrypt = require('bcryptjs');

// Dummy database for example
const users = [];

class User {
    constructor(firstname, lastname, email, password) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password; // Store hashed password
    }

    static emailExists(email) {
        return users.some(user => user.email === email);
    }

    static register(firstname, lastname, email, password) {
        const hashedPassword = bcrypt.hashSync(password, 8);
        const newUser = new User(firstname, lastname, email, hashedPassword);
        users.push(newUser);
        return true;
    }

    static getByAuth(email, password) {
        const user = users.find(user => user.email === email);
        if (user && bcrypt.compareSync(password, user.password)) {
            return user;
        }
        return null;
    }
}

module.exports = User;
