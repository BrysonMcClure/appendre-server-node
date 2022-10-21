import express from 'express';
import session from 'express-session';
import sessionController from "./controllers/session-controller.js";
import authenticationController from "./controllers/authentication-controller.js";
import mongoose from "mongoose";
import cors from "cors";
//ENV Imports
import dotenv from 'dotenv';
dotenv.config();
//Needs to be an env variable later
mongoose.connect('mongodb://localhost:27017/appendredb');
const app = express();

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(express.json());
//Will need to have whitelist domain changed to a env var later. This makes node server specific about
//which applications can access us and our data now. Needs to be so since we are using credentials.
//Not exactly sure yet how this works with granting access to resources.
app.use(cors({
    credentials: true,
    origin: 'http://localhost:3000'
}))

//Development Mode Stuff
let sess = {
    secret: 'superDuperSecret',
    cookie: {secure: false}
};

if(process.env.ENV === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

//app.use(express.json());
sessionController(app);
authenticationController(app);



//Make this an env variable later
app.listen(4000);