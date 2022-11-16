import mongoose from "mongoose";
import {options} from "../usersMDS/users-schema.js";

const palUsersSchema = mongoose.Schema(
    {
        followedPens: [{type: mongoose.Schema.Types.ObjectId, ref: 'PenUser'}],
        replies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Reply'}]
    }, options);
//renamin this from generic type schema to help avoid confusion with mutliple schems, think this won't cause any probblems/ should be a better approach going forward

export default palUsersSchema;