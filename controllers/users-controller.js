import usersDao from "../mongoManagment/usersMDS/users-dao.js";
import pensDao from "../mongoManagment/pensMDS/pens-dao.js";
import palsDao from "../mongoManagment/palsMDS/pals-dao.js";

const usersController = (app) => {
    app.put('/api/users/:uid', updateUser);
    app.get('/api/users/:uid', findUserById);
}

//A parent controller shoudl be always respnosbile for at the very least redirecting a valid child to the right resource, since
//after all, a user is a user, so I cant just turn them away reasonably i think. Right? Pretty sure of this with us citizen example I just explained to myself.

const updateUser = async (req, res) => {
    const uid = req.params.uid;
    const updatedUser = req.body;

    let status = await usersDao.updateUser(uid, updatedUser);

    //If it didnt change anything, try pens
    if (status && status.modifiedCount === 0) {
        status = await pensDao.updateUser(uid, updatedUser);
    }
    //If pens fails, it will return acknodleged false, so we can check for status becoming undefined, and then
    //We can fall through to the last option. This should never be reached in anyother way. Because modified count is defined
    //and equal to one if the parent level one for common attributes was a activated and something was changed.
    if (!status.modifiedCount) {
        status = await palsDao.updateUser(uid, updatedUser);
    }
    //big difference here between this and auth, = no change to session since this is not the logged in person.
    //authentication controlelr is responisble for managing who we point our cookie data too and guarding that
    //behind a username and password layer. Yea. nice.
    res.send(status);
}

//have to do population here now is the problem, else friends list added friend no populate right?
const findUserById = async (req, res) => {
    //Since this is generic find across all users when we dont know their type because, for example it may
    //just have been provided as an id in a path param, we search both types ann approriatley populate them.
    const uid = req.params.uid;
    //no longer using generic
    //const user = await usersDao.findUserById(uid);
    let user = await pensDao.findUserById(uid);
    if(!user) {
        user = await palsDao.findUserById(uid);
    }
    user.password = '*****';
    res.json(user);
}

export default usersController;