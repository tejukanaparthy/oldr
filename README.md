# OLDR

## Getting started with Setting Up PostgreSQL

To run this project, you need to have PostgreSQL installed and configured on your machine. Follow the steps below to set it up:

1. Install PostgreSQL
   For macOS users (using Homebrew):
   - Install Homebrew if it is not already installed:
     ```bash
     /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
     ```
   - Install PostgreSQL:
     ```bash
     brew install postgresql
     ```
   - Start the PostgreSQL service:
     ```bash
     brew services start postgresql
     ```
   - Verify the installation:
     ```bash
     pg_isready
     ```
     If PostgreSQL is running, you should see output like:
     ```
     /var/run/postgresql:5432 - accepting connections
     ```

   For other operating systems:
   - Follow the instructions for your OS on the [PostgreSQL official website](https://www.postgresql.org/download/).

2. Start PostgreSQL
   - Once PostgreSQL is installed, ensure it is running. For macOS with Homebrew, use:
     ```bash
     brew services start postgresql
     ```

3. Set Up the Database
   - Create a PostgreSQL user (if not already done):
     ```bash
     createuser -s postgres
     ```
     This creates a superuser with the default username `postgres`.
   - Create the required database:
     ```bash
     createdb my_database
     ```
   - Update the `.env` file (or configuration file) in the project with your PostgreSQL credentials. Example:
     ```makefile
     DATABASE_HOST=localhost
     DATABASE_PORT=5432
     DATABASE_USER=postgres
     DATABASE_PASSWORD=your_password
     DATABASE_NAME=my_database
     ```

4. Run the Setup Script
   - To set up the database schema and initial data, run the following command:
     ```bash
     ./setup.sh
     ```
     This script will check if PostgreSQL is running, create the necessary tables, and populate initial data.

5. Troubleshooting
   - If you encounter `pg_isready: command not found`, ensure PostgreSQL is in your `PATH`. Add the following to your shell configuration file:
     ```bash
     export PATH="/opt/homebrew/bin:$PATH"
     ```
     Then restart your terminal or run:
     ```bash
     source ~/.zshrc
     ```
```
