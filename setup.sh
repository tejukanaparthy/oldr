#!/bin/bash

# Variables
DB_NAME="user_management"
CREATE_SQL="db/create.sql"
LOAD_SQL="db/load.sql"

# Check if PostgreSQL is running
if ! pg_isready; then
    echo "PostgreSQL server is not running. Please start it first."
    exit 1
fi

# Create the database if it does not exist
echo "Creating database if it doesn't exist..."
createdb "$DB_NAME" 2>/dev/null

# Check if the database was created successfully
if [ $? -ne 0 ]; then
    echo "Database already exists or there was an error creating the database."
else
    echo "Database created successfully."
fi

# Run the create.sql script
echo "Running $CREATE_SQL..."
psql -d "$DB_NAME" -f "$CREATE_SQL"

# Run the load.sql script if it exists
if [ -f "$LOAD_SQL" ]; then
    echo "Running $LOAD_SQL..."
    psql -d "$DB_NAME" -f "$LOAD_SQL"
fi

echo "Database setup completed."
