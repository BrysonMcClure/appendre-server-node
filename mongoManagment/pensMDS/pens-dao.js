import penUserModel from "./pens-model.js"
//They both have meat and bones, this is not just a translation layer
//export const findUserByUsername = (username) => userModel.find({username : username});
//export const findUserByCredentials = (username, password) => userModel.find({$and : [{username : username}, {password : password}]});
//Should be populating friends list here so new object returned is always correct, even if it is just coming from the session anyway
//THats actually a good question, the seesion stores an object, how does it know to populate these things? we have get all for other things
//But i believe this is the only one where we use the common get unlike with letters and replies where their actions dont really overlap,
//at least yet anyway outside of crud stuff.
export const createUser = (newUser) => penUserModel.create(newUser);
//Populate is important for things like displaying a specific users letters and such. Up till now generalization has worked,but we need pupoluation here
export const findUserById = (peuid) => penUserModel.findOne({_id: peuid}).populate('collaborators.pen').populate('letters').populate('letters.replies');
export const updateUser = async (uid, updatedUser) => {
    const status = await penUserModel.updateOne({_id: uid}, {$set: {
        collaborators: updatedUser.collaborators,
        letters: updatedUser.letters
    }});
    return status;
}
export const findUserByUsername = async (username) => {
    let user = await penUserModel.findOne({username: username}).populate('collaborators.pen').populate('letters');
    return user;
    //userModel.findOne({username : username});
}

export const unpopulatedFindUserById = async (uid) => {
    const user = await penUserModel.findById(uid);
    return user;
}

//mongoose still ues create instead of insertOne, interesting
//export default {findUserByUsername, findUserByCredentials, createUser};
//returns a status only rememeber, so no population needed;
// export const updateLetter
export default {findUserById, createUser, updateUser, findUserByUsername, unpopulatedFindUserById};