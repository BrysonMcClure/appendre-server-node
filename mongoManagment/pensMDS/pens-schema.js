import mongoose from "mongoose";
import {options} from "../usersMDS/users-schema.js";

const penUserSchema = mongoose.Schema(
    {
        //Come back to the reference here, idk if that is anything we want, maybe should be UsersModel?
        collaborators: [{
            pen: {type: mongoose.Schema.Types.ObjectId, ref: 'PenUser'},
            status: String
        }],
        letters: [{type: mongoose.Schema.Types.ObjectId, ref: 'Letter'}]
    }, options);
//renamin this from generic type schema to help avoid confusion with mutliple schems, think this won't cause any probblems/ should be a better approach going forward

export default penUserSchema;
