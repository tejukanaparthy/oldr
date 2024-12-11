# OLDR (Online Elderly Request Dashboard)

OLDR is a web application designed to facilitate communication between elderly users and staff members. It allows elderly users to submit requests, which can then be managed by staff members. The application emphasizes accessibility, security, and ease of use.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

**User Authentication:** Secure registration and login functionalities for elderly and staff users.  
**Role-Based Access Control:** Different dashboards and permissions based on user roles.  
**Request Management:** Elderly users can submit requests, and staff members can manage them (fulfill, flag as important, delete).  
**Accessibility Enhancements:** Voice input for request submissions and speech synthesis for introductions.  
**Responsive Design:** Optimized for various devices, ensuring usability across desktops, tablets, and mobile devices.

## Prerequisites

Before setting up the application, ensure you have the following installed on your system:

**Node.js:** [Download here](https://nodejs.org/en/download/) (v14 or later).  
**npm:** Comes bundled with Node.js.  
**Git:** [Download here](https://git-scm.com/downloads).  
**SQLite3:** [Download here](https://www.sqlite.org/download.html) (for database management).

## Installation

**Step 1:** Clone the Repository.  
```bash
git clone https://github.com/yourusername/OLDR.git
```

**Step 2:** Navigate to the Project Directory.  
```bash
cd OLDR
```

**Step 3:** Install Dependencies.  
```bash
npm install
```

## Database Setup

**Step 1:** Initialize the Database.  
Run the initialization script to set up the database and create the necessary tables.
```bash
cd scripts
node initDatabase.js
```

**Step 2:** Verify Database Creation.  
Ensure that a `database.db` file is created in the `db/` directory. This file stores all application data.

## Running the Application

**Step 1:** Start the Server.  
Run one of the following commands:

- **Development Mode (with Nodemon):**  
  ```bash
  npm run dev
  ```

- **Production Mode:**  
  ```bash
  npm start
  ```

**Step 2:** Access the Application.  
Open your web browser and navigate to:  
```
http://localhost:3000
```

## Project Structure

```
OLDR/
├── src/
│   ├── controllers/
│   │   └── userController.js
│   ├── models/
│   │   └── user.js
│   ├── routes/
│   │   └── userRoutes.js
│   ├── utils/
│   │   └── dbUtils.js
│   ├── config/
│   │   └── database.js
│   ├── views/
│   │   ├── partials/
│   │   │   ├── header.ejs
│   │   │   └── footer.ejs
│   │   ├── login.ejs
│   │   ├── register.ejs
│   │   ├── staff.ejs
│   │   └── welcome.ejs
│   ├── public/
│   │   └── (static assets like CSS, JS, images)
│   ├── index.js
│   └── initDatabase.js
├── db/
│   └── database.db
├── .env
├── .gitignore
├── package.json
└── README.md
```

## Environment Variables

Create a `.env` file in the root directory of the project and define the following variables:

```env
SESSION_SECRET=your_secure_session_secret
PORT=3000
NODE_ENV=development
```

## Scripts

**test:** Runs tests using Jest.  
**start:** Starts the application in production mode.  
**dev:** Starts the application in development mode using `nodemon`.

## Testing

Run the following command to execute the test suite:
```bash
npm test
```

## Deployment

1. **Prepare Environment:** Ensure that all environment variables are set.  
2. **Deploy to Hosting Provider:** Choose a provider such as Heroku or AWS.  
3. **Start the Server in Production Mode:**  
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository.  
2. Create a new branch.  
3. Make changes and commit them.  
4. Push to your fork and submit a pull request.

## License

This project is licensed under the [ISC License](https://opensource.org/licenses/ISC).

## Acknowledgments

- [Express.js](https://expressjs.com/): Web framework for Node.js.  
- [EJS](https://ejs.co/): Templating engine.  
- [SQLite](https://www.sqlite.org/index.html): Lightweight database.  
- [Bootstrap](https://getbootstrap.com/): CSS framework.  
