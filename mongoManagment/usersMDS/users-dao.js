import usersModel from "./users-model.js";
//They both have meat and bones, this is not just a translation layer
export const findUserByUsername = (username) => usersModel.find({username : username});
export const findUserByCredentials = (username, password) => usersModel.find({$and : [{username : username}, {password : password}]});
export const createUser = (newUser) => usersModel.create(newUser);
//mongoose still ues create instead of insertOne, interesting
export default {findUserByUsername, findUserByCredentials, createUser};