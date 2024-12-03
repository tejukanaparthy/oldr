# OLDR - Chat Service for the Elderly

Welcome to OLDR, the chat service designed specifically for the elderly. This application allows users to register, log in, and access chat functionalities tailored to their needs.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Testing the Application](#testing-the-application)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Features

- **User Registration:** Allows new users to sign up with their details.
- **User Login:** Authenticates existing users.
- **Session Management:** Maintains user sessions across requests.
- **Welcome Page:** Greets authenticated users with a personalized message.
- **Logout Functionality:** Allows users to securely log out.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js** (v22.0.0 or later)
- **npm** (Node Package Manager)
- **Git**
- **SQLite3**

### Installing Node.js and npm

Download and install Node.js from [here](https://nodejs.org/). npm is bundled with Node.js.

### Installing Git

Download and install Git from [here](https://git-scm.com/downloads).

### Installing SQLite3

SQLite3 is used as the database for this application.

- **macOS:**

  ```bash
  brew install sqlite
  ```

- **Ubuntu:**

  ```bash
  sudo apt-get install sqlite3 libsqlite3-dev
  ```

## Installation

To install OLDR, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone <repository_url>
   ```

2. **Navigate to the project directory:**

   ```bash
   cd oldr
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

## Configuration

1. **Environment Variables:**

   Create a `.env` file in the root directory and add the following environment variables:

   ```env
   PORT=3000
   JWT_SECRET=your_secure_jwt_secret_key
   SESSION_SECRET=your_secure_session_secret
   DATABASE_URL=sqlite:./database.db
   ```

2. **Initialize the Database:**

   Run the setup script to create the necessary tables:

   ```bash
   npm run setup
   ```

## Running the Application

To run the application, use the following command:

```bash
npm start
```

The server will start on `http://localhost:3000`.

## Testing the Application

1. **Register a New User:**

   Navigate to `http://localhost:3000/register` to register a new user.

2. **Log in:**

   Go to `http://localhost:3000/login` to log in with your credentials.

3. **Welcome Page:**

   After logging in, you will be redirected to a welcome page.

## Project Structure

```plaintext
oldr/
├── src/
│   ├── index.js            # Main server file
│   ├── routes/
│   │   └── userRoutes.js   # User-related routes (registration, login)
│   ├── models/
│   │   └── user.js         # User model definition
│   ├── views/              # EJS templates
│   ├── config/
│   │   └── database.js     # Database connection setup
│   └── scripts/
│       └── initDatabase.js # Script to initialize the database
├── .env                    # Environment variables
├── package.json            # Project metadata and dependencies
├── README.md               # Project documentation
└── database.db             # SQLite database file
```

## Technologies Used

- **Node.js**: JavaScript runtime for server-side development.
- **Express.js**: Web framework for Node.js.
- **SQLite3**: Relational database for storing user data.
- **Sequelize**: ORM for handling database operations.
- **EJS**: Embedded JavaScript templating for rendering views.

## Querying the Database (to test to see if everything is working)

To query the SQLite database directly in the terminal, follow these steps:

1. **Open the SQLite shell:**

   ```bash
   sqlite3 database.db
   ```

2. **View all tables:**

   ```sql
   .tables
   ```

3. **Query data from a table (e.g., Users table):**

   ```sql
   SELECT * FROM Users;
   ```

4. **Exit the SQLite shell:**

   ```sql
   .exit
   ```

## Contributing

To contribute to OLDR, fork the repository and create a pull request. For major changes, please open an issue to discuss what you would like to change.

## License

This project is licensed under the MIT License.
