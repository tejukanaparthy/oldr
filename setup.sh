#!/bin/bash

echo "Installing project dependencies..."
npm install

echo "Initializing the SQLite database..."
node scripts/initDatabase.js

echo "Setup complete. You can now run the application using 'node app.js'."
