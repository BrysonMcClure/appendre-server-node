//import sessionController from "./session-controller.js";
import usersDao from "../mongoManagment/usersMDS/users-dao.js"
import pensDao from "../mongoManagment/pensMDS/pens-dao.js";
import palsDao from "../mongoManagment/palsMDS/pals-dao.js";
import bcrypt from "bcrypt";

//Just a good old fashioned constant for consitency's sake later I think
const saltRounds = 10;

const authenticationController = (app) => {
    app.post("/api/auth/login", login);
    app.post("/api/auth/signup", signup);
    //Should really be a get
    app.post("/api/auth/profile", profile);
    //should really be a delete
    app.post("/api/auth/logout", logout);
    app.post("/api/auth/checkUsernameAvailability", checkUsernameAvailability);
    app.get("/api/auth/:uid", getUserById);
    app.get("/api/auth", findUsersByAttribute);
}

const checkUsernameAvailability = async (req,res) => {
    const existingUser = await usersDao.findUserByUsername(req.body.username);
    const returnUser = existingUser;
    if(existingUser) {
        //Avoid exposing passwords over the air
        returnUser.password ='';
    }
    res.json(returnUser);
}

const login = async (req, res) => {
    const user = req.body;
    const username = user.username;
    const password = user.password;
    //const existingUser = await usersDao.findUserByCredentials(username, password);
    const existingUser = await usersDao.findUserByUsername(username);

    //Dont proceed with polling for password if search result is undefined. This is a little messy,
    //Will maybe look into if there is a better way to go about this. Not sure at the moment.
    if(!existingUser) {
        res.sendStatus(403);
        //added to fix fall through issue, apperntly res statements do not act like returns in terms of halting
        //logic and operation
        return;
    }

    const match = await bcrypt.compare(password,existingUser.password);

    if(match) {
        //So we dont send the password back over the air
        existingUser.password = '*****';
        req.session['profile'] = existingUser;
        res.json(existingUser);
    } else {
        //Server recognizes request but refuses to authorize it, i.e. access forbidden
        //So the thing in the parans, in this case (403), I think is called a "header" according to the error documentation.
        res.sendStatus(403);
    }

}

const signup = async (req, res) => {
    const newUser = req.body;
    const password = newUser.password;
    //Maybe should add a third arg later which would be an error handeling function. Not sure of casses
    //in which this would error out?
    const hash = await bcrypt.hash(password, saltRounds);
    newUser.password = hash;
    const existingUser = await usersDao.findUserByUsername(newUser.username);
    //const existingUserUserNameThisIsStupidIfThisWorks = existingUser.username;

    if(existingUser) {
        //The lesson here was find returns an array of objects, meanwhile create returns an object directly,
        //thus other functions get to use the obj directly, but we have to access it as an array element,
        //there should only ever be at most one result. Now if its defined we can do this here.
        //Server recognizes request but refuses to authorize it, i.e. access forbidden
        //res.json({"message" : `${existingUser[0].username}`});
        res.sendStatus(403);
        return;
    }
    //Else is not neccessary since if above if is activated, it returns so operation of rest of function
    //ceases immidatley anyway
    let insertedUser;
    switch (newUser.role) {
        case 'PEN':
            insertedUser = await pensDao.createUser(newUser);
            //In other switch examples, return statements at the end of the case were breaking the waterfall, thus we need break statements here then.
            //From w3 schools, If you omit the break statement, the next case will be executed even if the evaluation does not match the case.
            //A good lesson to learn. Glad we checked it now before we ended up with a bunch of duplicate, incomplete records
            break;
        case 'PAL':
            insertedUser = await palsDao.createUser(newUser);
            break;
        case '':
            insertedUser = await usersDao.createUser(newUser);
    }
    insertedUser.password = '*****';
    //Should automatically override anyone already logged in, appears to be/do so.
    req.session['profile'] = insertedUser;
    res.json(insertedUser);

}

const profile = (req, res) => {
    res.json(req.session['profile']);
}

const logout = (req, res) => {
    req.session.destroy();
    //All is ok status
    res.sendStatus(200);
}

const getUserById = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersDao.findUserById(userId);
    user.password = '*****';
    res.json(user);
}

const findUsersByAttribute = async (req, res) => {
    const queryObject = req.query;
    const [key, value] = Object.entries(queryObject)[0];
    let filter;
    switch (key) {
        case "username":
            filter = {username : {$regex: value, $options: 'i'}};
            break;
        case "role":
            filter = {role : {$regex: value, $options: 'i'}};
            break;
        default:
            filter = null;
    }
    if(filter) {
        const users = await usersDao.findUsersByAttribute(filter);
        res.json(users);
        return;
    }
    res.send(200);
}



export default authenticationController;