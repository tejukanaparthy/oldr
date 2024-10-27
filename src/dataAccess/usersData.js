/**
 * This module contains all the 
 * CRUD operations on Users
 * Design principles:
 * - Open/Close [High cohesion/Low coupling]
 * - Separation of concerns
 * - SRP (Single Responsibility Principle) functions perform 1 action only
 */


// import DB connection functions
const {closeMongoDBConnection, getDB } = require('../utils/dbUtils');

// import ObjectID [constructor] function
const { ObjectId } = require('mongodb');

/**
 * CREATE a new user
 * @param {*} newUser 
 * @returns the id of the user in the db
 * @throws an error if the operation fails
 */
const addUser = async (newUser) => {
    try{
        // get the db
        const db = await getDB();
        const result = await db.collection('users').insertOne(newUser);
        // log the id of the student
        console.log(`New user created with id: ${result.insertedId}`);
        // return the result
        return result.insertedId;
    }catch(err){
        console.log(`error: ${err.message}`);
        throw new Error("user not created");     
    } finally{
      // do not forget to close the resources/connections
      await closeMongoDBConnection();
    }
  };
  
  /**
   * READ all the users
   * @returns the list of all users
   * @throws an error if the operation fails
   */
  const getAllUsers = async () => {
    try {
      // get the db
      const db = await getDB();
      const result = await db.collection('users').find({}).toArray();
      // print the results
      console.log(`Users: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error("cannot read all users"); 
    }finally{
      // do not forget to close the resources/connections
      await closeMongoDBConnection();
    }
  };
  
  /**
   * READ a user given their ID
   * @param {*} userID - the id of the user
   * @returns the user object
   * @throws an error if the operation fails
   */
  const getUser = async (userID) => {
    try {
      // get the db
      const db = await getDB();
      // use mongo objectID constructor
      const result = await db.collection('users').findOne({ _id: new ObjectId(userID) });
      // print the result
      console.log(`User: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error(`cannot read user with is ${userID}`);
    }finally{
      // do not forget to close the resources/connections
      await closeMongoDBConnection();
    }
  };
  
  /**
   * READ a user given their username
   * @param {*} username 
   * @returns returns the user object
   * @throws an error if the operation fails
   */
  const getUserByUName = async (username) => {
    try {
      // get the db
      const db = await getDB();
      const result = await db.collection('users').findOne({ username: username });
      // print the result
      console.log(`Student: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error(`cannot read user with id ${username}`);
    }finally{
      // do not forget to close the resources/connections
      await closeMongoDBConnection();
    }
  };
  
  
  /**
   * UPDATE the username given the id
   * @param {*} userID - id of user
   * @param {*} newUName - new username
   * @returns the numbr of records updated 
   * (must be 1 for success / 0 if id not found)
   * @throws an error if the operation fails
   */
  const updateUser = async (userID, newUName) => {
    try {
      // get the db
      const db = await getDB();
      const result = await db.collection('users').updateOne(
        { _id: ObjectId(userID) },
        { $set: { username: newUName } },
      );
      return result;
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error(`cannot update user with id ${userID}`);
    }finally{
      // always close the resources/connections
      await closeMongoDBConnection();
    }
  };
  

  /**
   * DELETE a user given their ID
   * @param {*} userID 
   * @returns the numbr of records updated 
   * (must be 1 for success / 0 if id not found)
   * @throws an error if the operation fails
   */
  const deleteUser = async (userID) => {
    try {
      // get the db
      const db = await getDB();
      const result = await db.collection('users').deleteOne(
        { _id:  ObjectId(userID) },
      );
      // print the result
      console.log(`Student: ${JSON.stringify(result)}`);
      return result;
    } catch (err) {
      console.log(`error: ${err.message}`);
      throw new Error(`cannot delete user with id ${userID}`);
    }finally{
      // always close the resources/connections
      await closeMongoDBConnection();
    }
  };
// Begin - to run the code
/** 
  async function main(){
    // await addUser({username: 'toto2', password: 'tata2'});
    await getAllUsers();
    
   await closeMongoDBConnection();
  }
  // main();
  // export the functions
*/
// Begin - to run the code

// export functions
  module.exports = {
    addUser,
    getAllUsers,
    getUser,
    getUserByUName,
    updateUser,
    deleteUser,
  };
  