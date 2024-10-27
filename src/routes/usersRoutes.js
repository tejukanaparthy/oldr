/**
 * This module implements users endpoints
 * routes handler functions
 * No exception is thrown instead
 * we return the appropriate status code
 * 
 */


// import users db operations
const { getUserByUName, addUser } = require('../dataAccess/usersData');

/**
 * Login endpoint route handler
 * @param {*} req - http request
 * @param {*} res - http response
 */

const loginUser = async function (req, res) {
    // check that the username and password  are in the body
    
    if(!req.body.username || req.body.username===''){
      res.status(400).json({error: 'empty or missing username'});
      return;
    }
    if(!req.body.password || req.body.password===''){
      res.status(400).json({error: 'empty or missing password'});
      return;
    }
    // [missing] you should create utility functions
    // to validate the username and password
    // before authenticating the user 
    try {
        const user = await getUserByUName(req.body.username);
      // send the apropriate response
      if(user && req.body.password === user.password){
        res.status(201).json({login: true});
      } 
      else if(!user){
        res.status(404).json({error: 'user does not exist'});
      }
      else{
        res.status(401).json({error: 'wrong password'});
      }
  
    } catch(err){
      console.log('error login', err.message)
      res.status(400).json({error: 'hey I am an error'});
    }
  }
  
  
  
const registerUser = async function(req, res){
    // parse the body
    if(!req.body.username || !req.body.password){
        res.status(404).json({message: 'missing username or password in the body'});
        return;
    }
    /**
     * [missing (1)] create a utility function
     * to validate the format of the email and
     * password. 404 response if it fails.
     */

    /**
     * [missing (2)] 
     * check if the username  is already 
     * in the DB. 409 response if it fails.
     */
    


    //[(3)] create the new user object
    const newUser = {
        username: req.body.username,
        password: req.body.password,
    }
    try{
        const result = await addUser(newUser);
        res.status(201).json({data: {id: result}});
    }catch(err){
        res.status(500).json({message: 'There was an error'});
    }
}
    

  

  // export functions
  module.exports = {
    loginUser,
    registerUser
  };

