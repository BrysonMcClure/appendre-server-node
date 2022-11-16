import palUserModel from "./pals-model.js";
//They both have meat and bones, this is not just a translation layer
//export const findUserByUsername = (username) => userModel.find({username : username});
//export const findUserByCredentials = (username, password) => userModel.find({$and : [{username : username}, {password : password}]});
export const createUser = (newUser) => palUserModel.create(newUser);
//might need to look into some sort of deep reply later dependign on how we end up using this data
export const findUserById = (pauid) => palUserModel.findOne({_id: pauid}).populate('followedPens').populate('replies');
export const updateUser = async (pauid, palUser) => {
    //Only setting the pal specific options. Relying on parent serving as top layer to handle others to avoid repated code
    //need to async await?
    const status = await palUserModel.updateOne({_id: pauid},{$set: {
        followedPens: palUser.followedPens,
        replies: palUser.replies
    }});
    return status;
}
export const findUserByUsername = async (username) => {
    let user = await palUserModel.findOne({username: username}).populate('followedPens').populate('replies');
    return user;
    //userModel.findOne({username : username});
}

export const unpopulatedFindUserById = async (uid) => {
    const user = await palUserModel.findById(uid);
    return user;
}
//mongoose still ues create instead of insertOne, interesting
//export default {findUserByUsername, findUserByCredentials, createUser};
export default {createUser, findUserById, updateUser, findUserByUsername, unpopulatedFindUserById};