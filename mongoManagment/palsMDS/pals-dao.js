import palUserModel from "./pals-model.js";
//They both have meat and bones, this is not just a translation layer
//export const findUserByUsername = (username) => userModel.find({username : username});
//export const findUserByCredentials = (username, password) => userModel.find({$and : [{username : username}, {password : password}]});
export const createUser = (newUser) => palUserModel.create(newUser);
//mongoose still ues create instead of insertOne, interesting
//export default {findUserByUsername, findUserByCredentials, createUser};
export default {createUser};