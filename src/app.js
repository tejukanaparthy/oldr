/**
 * Express webserver / controller
 */

// import express
const express = require('express');

// import the cors -cross origin resource sharing- module
const cors = require('cors');

// create a new express app
const webapp = express();


// enable cors
webapp.use(cors());

// configure express to parse request bodies
webapp.use(express.urlencoded({extended: true}));
// import routes handlers
const { loginUser, registerUser } = require('./routes/usersRoutes')

// root endpoint route
webapp.get('/', (_req, resp) =>{
    resp.json({message: 'hello HS4SWE friends!!!'})
});


/**
 * Login endpoint
 * 
 */
webapp.post('/login', loginUser);


/**
 * route implementation POST /user
 * 
 */
webapp.post('/user', registerUser);

// export the webapp
module.exports = webapp;