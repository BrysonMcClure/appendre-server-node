//import sessionController from "./session-controller.js";
//responsible for anything dealing with profile (aka logged in user, as well as
//anything to deal with logging in and out. Basically authenticaition will now refer to anything invloving
//changes to the user so long as they are in session/ the session in general, since
//that is an access control level concern.
import usersDao from "../mongoManagment/usersMDS/users-dao.js"
import pensDao from "../mongoManagment/pensMDS/pens-dao.js";
import palsDao from "../mongoManagment/palsMDS/pals-dao.js";
import letterDao from "../mongoManagment/lettersMDS/letter-dao.js"
import bcrypt from "bcrypt";
import userModel from "../mongoManagment/usersMDS/users-model.js";

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
    app.put("/api/auth/update/:uid", updateUser);
    //no body on this one. I think this is fine right? I dont think it breaks any sort of rest rules or anything right?
    app.put("/api/auth/:pid/acceptCollaboration/:uid", acceptCollaboration);
    app.put("/api/auth/:pid/requestsCollaboration/:uid", requestsCollaboration);
    app.put("/api/auth/:pid/follow/:uid", follow);
    app.delete("/api/auth/:pid/deleteLetter/:lid", deleteLetter);
    app.post("/api/auth/:pid/writeLetter", writeLetter);
}

//no local changes = everything pulled directly from server session to maintain parody.
//lets clean up some messy overlaps if we can and try and keep things as un-cross contaminated as possible.
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
    //a user with just username and password filled out is provided
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

//need to change to support multiple types and population of fields. Even belong here or more of a generic user controller thing?
//the login controllers and stuff would just be calling the dao anyway.
//not really something that would ever concern itself with the session, i think maybe
//was jsut placed in here in the bbegining because this was the only active line to user data that we had.
//seems a little cross contaiminationee now. Now kinda of wanting everything in here now to deal with updating the session/ logged in user only.
//this was probably jsut the only/ best plac at the time I am thinking now/ if I am remebering correctly.
const getUserById = async (req, res) => {
    const userId = req.params.uid;
    const user = await usersDao.findUserById(userId);
    user.password = '*****';
    res.json(user);
}

//Same with this one as above. Deals more with the generic class to operate on other users and find their data,
//and doesnt really have much to do with session reelated/ signed in user stuff.
//again, made perfect sense at the time but I feel this is better moved to a class dealing with
//other users besides the currently logged in one, and stuff that doesnt have a reducer connected on the
//client side. Reeally only effecting data base, and then calls that call when they need the data, store to a local
//state var (kind of like we were originally doing with profile) only, and then go from there recalling whenever
//they need an update and I think that should be it maybe. maybe.
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
//pal/pen user is still a user. so ok to still use uid? or too generic? not sure yet, going to stick with uid for
//simplicty for now maybe? hmm not sure. may just keep inconsistent, not sure yet.
//more error checking for bad requests? maybe something to work with later, for now can hopefully just assume
//ideal reequests from ye olde client side hopefully, just while in development. HMMMMMM.mmmmmmmmmmmmmmmmm
//should the waterfall part of this actually go in the users dao now that we aree doing that for other things?
//Maybe it should to keep things clean. I hope users dao/ controller isnt over stepping,
//but i really dont think it is, we are just taking the responsibilty away form the client to know
//behind the scenes how we deal with this an essentially making it so you just call the parent for everything,
//reather than repeating code and always knowing what type of document you have. have one service for all
//is probably better right? this is a really hard decision to make.
const updateUser = async (req, res) => {
    const uid = req.params.uid;
    const updatedUser = req.body;
    //For now can't imagine a scenario where youd be updating a geneeric attribute and a pen/pal specific one at once,
    //so for now they waterfall through the updates like this, generic then specific. so for now one callshould equal one attribbute changed, at leaster per category
    //also i think its fine to call update for the wrong dao since the find should just fail right?, may need to changee/ guard.
    //this is coming up as undefined, but maybe thats because the await isnt actually awaiting the promise yet maybe,
    //weve had probelms with this before i think, its asynchrnous respectivley only to the
    //end of the function I think maybbe???????
    //status should be defined even if it doesnt find anyhting/ match right?

    //know this parent level will get acknowledged
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
    //const status = await pensDao.updateUser(uid, updatedUser);
    //La piece de resitance, update the user, then keep the session in pardoy with the changes, using our find by
    //for population purposes. One dao call another == approriate?
    //Going with that for now, this should set session to properly populated user.
    //Add a check against bad request which could change who is logged in? More of an internal thing that is maybe les simportant for now,
    //just something maybe to consider with regards to buteenting down security of this api going forward.
    req.session['profile'] = await usersDao.findUserById(uid);
    res.send(status);
}

const requestsCollaboration = async (req, res) => {
    const pid = req.params.pid;
    const uid = req.params.uid;
    let profileUser =  await unpopulatedFindUserById(pid);
    const collabUser = await unpopulatedFindUserById(uid);
    //Modify
    profileUser.collaborators.push({pen: uid, status: "PENDING"});
    //Update DB
    const response = await updateUserFunction(pid, profileUser);

    collabUser.collaborators.push({pen: pid, status: "REQUESTED"});
    const userResponse = await updateUserFunction(uid, collabUser);

    //state parody
    req.session['profile'] = await usersDao.findUserById(pid);
    res.send(response);

}

const follow = async (req, res) => {
    const pid = req.params.pid;

    //Protect against trying to do something not targeting the currently logged in user, prevents against password circumvention as well.
    if(pid !== req.session['profile']._id){
        res.sendStatus(403);
        return;
    }

    const uid = req.params.uid;
    //Collab user doesnt know I am following them, yet... this may change later so we can show followers maybe kind of like other social media websites
    let profileUser =  await unpopulatedFindUserById(pid);
    profileUser.followedPens.push(uid);
    const response = await updateUserFunction(pid, profileUser);
    req.session['profile'] = await usersDao.findUserById(pid);
    res.send(response);
}

const deleteLetter = async (req, res) => {
    const pid = req.params.pid;
    const lid =req.params['lid'];

    if(pid !== req.session['profile']._id){
        res.sendStatus(403);
        return;
    }

    let profileUser = await unpopulatedFindUserById(pid);
    profileUser.letters = profileUser.letters.filter(letterId => letterId !=  lid);
    let response = await updateUserFunction(pid, profileUser);
    if(response.modifiedCount === 1) {
        response = await letterDao.deleteLetter(lid);
    }
    //Still need to fix this to move it into the countroller and out of the dao ust maybe for consitency's sake if anything maybe right?
    req.session['profile'] = await usersDao.findUserById(pid);
    res.send(response);

}

const writeLetter = async (req, res) => {
    const pid = req.params['pid'];
    const newLetter = req.body;
    newLetter.author = pid;

    if(pid !== req.session['profile']._id){
        res.sendStatus(403);
        return;
    }

    let profileUser = await unpopulatedFindUserById(pid);

    let addedLetter = await letterDao.createLetter(newLetter);
    if(addedLetter) {
        profileUser.letters.push(addedLetter._id);
    }
    const response = await updateUserFunction(pid, profileUser);

    req.session['profile'] = await usersDao.findUserById(pid);

    if(response.modifiedCount === 1) {
        res.send(addedLetter);
    }
}

const acceptCollaboration = async (req, res) => {
    const pid = req.params.pid;
    const uid = req.params.uid;
    let profileUser =  await unpopulatedFindUserById(pid);
    const collabUser = await unpopulatedFindUserById(uid);
    //Change my relationship to the collab user to be active
    // profileUser.collaborators = profileUser.collaborators.map((collaborator) => {
    //     if(collaborator.pen == uid) {
    //         //return {pen: uid, status: "ACTIVE"}
    //         return{pen: uid, status: "ACTIVE"}
    //     }
    //     else {
    //         //return {pen: uid, status: "ACTIVE"}
    //         return collaborator;
    //     }
    //     //return ({...collaborator, status: "ACTIVE"});
    //     //return (collaborator.pen === uid ? {...collaborator, pen: uid, status: "ACTIVE"} : collaborator)
    // });
    //also things were populating correctly which told me at some point, they were all in fact id objects, but again i think there msut be some sort of casting that
    //goes on in some of our set methods sinc object id knows it constss of a string and is initialized/ made up of/ seeded/ given by such now that I think about it hmmmahyayayhahahha.
    //Ok, so this was again yet another shit show of painful discovery. Basically, here are the key takeaways.
    //We need to use == equality check vs ===. The long and skinny of it is == does type coersion before comparing to just check the values are equal. === does no
    //such coerscion, and so types are preserved. I guess this makes sense and may explain some other weird behavior. Initially it was my gut reaction to be confused by this
    //because as far as I know all id values here should be the same tupe. But, i think I am learning that when we pass data over the wire in our path param, we are actually passing just a string
    //and in the instances where our dao methods and such have needed an id, they cast the string to such. (Makes me wonder about some other type issues I had with some local state things, but
    //That may be a seperate issue. Either way, I guess that makes sense, and so here we needed to be doing a coerced check so it was string value to string value instead of string to object id check
    //which doesnt work. THe second issue here is that modify doesnt modify a record if it detects nothing changed. It does this by checking ids which all objects have, and if it has been modified. I
    //think this also may only apply on buried things. Basically I have to replace the record with a new one, rather then just chaning the status, so the id changes, otherwise modify doesnt trigger.
    //seems like there may also be a more percise operation we could use the dao to edit specifiically a perticular array element according to a query which we may want to look in to, especially if we have
    //the location, and so we may want to look into that methodology of using a filter we send over to a non update method. Basically In general I am starting to question/ reimagine how we use
    //update, since we used in it one way in the examples, but thinking about it more, this new methodology makes a little more sense and puts less burden on the client side for knowing how the
    //data is supposed to work behind the scenes, and instead makes things a little more like what I might htink a restful api would be, something we publish without the client necessarily knowing how it works,
    //and we deal more in commands of what should happen to the data and responses, and then maintain sate as the / our/ the clients responsibilty vs/ as opposed to having to know the strucutre behind the curtain.
    //Ok, so all this to say I am very tired and I think I am goign to switch to this methodology.
    profileUser.collaborators = profileUser.collaborators.map((collaborator) => {return (collaborator.pen == uid ? {pen: uid, status: "ACTIVE"} : collaborator)});
    let profileStatus = await updateUserFunction(pid, profileUser);
    //const profileStatus = await profileUser.save();
    //change collab users relationship to me to be active
    collabUser.collaborators = collabUser.collaborators.map((collaborator) => {return (collaborator.pen == pid ? {pen: pid, status: "ACTIVE"} : collaborator)});
    const userStatus = await updateUserFunction(uid, collabUser);
    //Update the session, should add checks for status actually having triggered maybe? or not important? since
    //the update is just a repolling of the populated variety and so really shouldnt be that shocking right?
    //this should be guarded to not let you change users, have had accidental problems with that just now which theoretically would let a user client side designer accidentally circumvent
    //the login controller.
    //populated version
    req.session['profile'] = await usersDao.findUserById(pid);
    res.send(profileStatus);
}

const updateUserFunction = async(uid, updatedUser) => {
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
    //return status;
    //const status = await pensDao.updateUser(uid, updatedUser);
    return status;
}

const unpopulatedFindUserById = async(uid) => {
    let user = await pensDao.unpopulatedFindUserById(uid);

    if(!user) {
        user = await palsDao.unpopulatedFindUserById(uid);
    }
    if(!user) {
        user = await usersDao.unpopulatedFindUserById(uid);
    }
    return user;

}



export default authenticationController;