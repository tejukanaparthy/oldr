/**
 * Entry module
 * to run do: npm start (node index.js)
 */

// import the express app
const webapp = require('./src/app');

// set up the app port number
const port = 8080;

// start the web server
webapp.listen(port, () =>{
    console.log('Server running on port', port);
})