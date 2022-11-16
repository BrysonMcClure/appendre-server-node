import userModel from "./users-model.js";
import pensDao from "../pensMDS/pens-dao.js";
import palsDao from "../palsMDS/pals-dao.js";
//Having parent be responsible for dealing with specifics, since at the end of the day,
//I fufill the expectation or returning a user, while minimizing the need for calling classes
//to perform logic on what to call.

//again, a pen or pal is still a user, so theoretically this shouldnt break anything, fingers crossed.
//They both have meat and bones, this is not just a translation layer
export const findUserByUsername = async (username) => {
    let user = await palsDao.findUserByUsername(username);
    if(!user) {
        user = await pensDao.findUserByUsername(username);
    }
    if(!user) {
        user = await userModel.findOne({username: username});
    }
    return user;
    //userModel.findOne({username : username});
}
export const findUserByCredentials = (username, password) => userModel.find({$and : [{username : username}, {password : password}]});
export const findUserById = async (uid) => {
    //Doing this waterfall to try and use built in methods of respective daos for population
    //Nothing in top user level needs population I believe atm.
    //Theoretically, for example user should be undefined if calling pens find by on a pal,
    //Have to see if this behaves as expected. Should never hit fall through case, but i guess we shall see, this avoids
    //having to type check before calling approriate method theroetically.
    let user = await pensDao.findUserById(uid);
    if(!user) {
        user = await palsDao.findUserById(uid);
    }
    if(!user) {
        user = await userModel.findOne({_id : uid});
    }
    return user;
}
export const unpopulatedFindUserById = async (uid) => {
    const user = await userModel.findById(uid);
    return user;
}
export const findUsersByAttribute = async (filter) => userModel.find(filter);
export const createUser = (newUser) => userModel.create(newUser);
//Password notably will not be changed this way and will require special bcrypt steps, want to avoid
//a passed value from client accidentally overriding with the dummy passowrd sent over wire. Role is immutable,
//for now changing your role will be impossible and neccesitate a new account. Maybe want to add the complicated
//through logic to allow this later, but not now. Thats more of an account migration then a simple update like profile pic or language which
//are simplified less tethered fields.
export const updateUser = (uid, updatedUser) => {
    const response = userModel.updateOne({_id: uid}, {$set : {
        username: updatedUser.username,
            profilePic: updatedUser.profilePic,
        language: updatedUser.language}});
    return response;
}
//mongoose still ues create instead of insertOne, interesting
export default {findUserByUsername, findUsersByAttribute, unpopulatedFindUserById, findUserById, findUserByCredentials, createUser, updateUser};