import mongoose from "mongoose";
import {options} from "../document-schema.js";

const replySchema = mongoose.Schema(
    {
        //Required, check in dao or maybe in the controller? Should not create if undefined, maybe just make impssoble via user side control flow? Is that sufficient or should we also/ is it maybe also better to put a saftey control on that from here.
        parentLetter: {type: mongoose.Schema.Types.ObjectId, ref: 'Letter'},
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'PalUser'},
        troubleWords: [String],
        feedback : {
            text: String,
            author: {type: mongoose.Schema.Types.ObjectId, ref: 'PenUser'}
        }
    }, options);
//Passing same options object as parent, because all going into the same collection, allowing us to do things like common searches etc.
export default replySchema;