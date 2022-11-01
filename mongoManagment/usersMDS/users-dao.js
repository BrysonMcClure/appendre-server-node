import userModel from "./users-model.js";
//They both have meat and bones, this is not just a translation layer
export const findUserByUsername = (username) => userModel.find({username : username});
export const findUserByCredentials = (username, password) => userModel.find({$and : [{username : username}, {password : password}]});
export const findUserById = async (uid) => userModel.findOne({_id : uid});
export const createUser = (newUser) => userModel.create(newUser);
//mongoose still ues create instead of insertOne, interesting
export default {findUserByUsername, findUserById, findUserByCredentials, createUser};