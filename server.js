import express from 'express';
//import session from 'express-session';
import session from 'cookie-session';
import sessionController from "./controllers/session-controller.js";
import authenticationController from "./controllers/authentication-controller.js";
import lettersController from "./controllers/letters-controller.js";
import repliesController from "./controllers/replies-controller.js";
import usersController from "./controllers/users-controller.js";
import mongoose from "mongoose";
import cors from "cors";
//ENV Imports
// import * as dotenv from 'dotenv';
// dotenv.config();

//so run $ node -r dotenv/config your_script.js on local instead? hmmmm

//Needs to be an env variable later
//Not sure what the newurl parser is yet. using this feature for parsing image data as string encodins is now to me
//, {useNewUrlParse: true, useUnifiedTopology: true}
//eendedup not using this stuff really. ended up being a for server side image upload as opposed to client react side image upload thing
//more so I think/ If i remeber correctly.
//ok so has something to do with deprecated url parsing. Somehow, I am thinking we dont actually need this since as far as a i can tell,
//it has nothing specific to do with images and is just a general things some others seem to need but for us everything is working just fine for  now
//without it. Fingers crossed this doesnt come back to bite us in the future.

//const CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/appendredb'
const CONNECTION_STRING = 'mongodb+srv://brysonmcclure:appendreAPI@cluster0.5drzcoi.mongodb.net/?retryWrites=true&w=majority'
//Reminder: this is called a connection string: the string that describes the location where we can connect to our mongo db!
mongoose.connect(CONNECTION_STRING);
const app = express();

app.set('trust proxy', 1);
//Will need to have whitelist domain changed to a env var later. This makes node server specific about
//which applications can access us and our data now. Needs to be so since we are using credentials.
//Not exactly sure yet how this works with granting access to resources.
app.use(cors({
    credentials: true,
    origin: (process.env.ORIGIN || 'http://localhost:3000')
}))

//Development Mode Stuff
let sess = {
    secret: process.env.SESSION_SECRET,
    cookie: {
        secure: true,
        //httpOnly: false,
        sameSite: 'none'
    }
};

//Need to work on this when we switch to a production instance sine right now we are just hardcoding secure props on cookies for ease of access without https
if(process.env.ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}



app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: sess.secret,
    cookie: sess.cookie
}));
//What exactly does express json do? Modifying this now to add a file limit it seems.
//So express json is our middleware funciton/ library/ whatever that allows express to read the body of an
//http request and turn it into a json object which we can then perform our regular operations on.
//I believe the options we are setting ehre limit file sizes in that json
app.use(express.json({limit: "30mb", extended: true}));
//My best guess would be that this tells express that some of the options may be url encoded strings? idk
//huh, this doesnt appear to actually do anythuing. I do think the 30mb part option is important for preventing too large files,
//otherwise i kinda feel like most everythuing here was/ is already set up, so im not to worried about it. i think we may be
//supporting our url encoding stuff already in a different way. either way going to leave this commented out for now. Just to note
//in case/ we run into some mysterious strange problems later. for now i really think the image is just a string, so as far as our
//node system goes, not really much needs to change beyond adding that single, non nested object atrribute to our schema, that is lovel isnt it?!
//Love it when it comes together and after a lot of hard work we are able to find a nice/ simple/ and east solution like that.
//app.use(express.urlencoded({limit: "30mb", extended: true}));

//app.use(express.json());
sessionController(app);
authenticationController(app);
lettersController(app);
repliesController(app);
usersController(app);



//Make this an env variable later
app.listen(process.env.PORT || 4000);