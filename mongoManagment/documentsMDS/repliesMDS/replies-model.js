import mongoose from "mongoose";
import replySchema from "./reply-schema.js";
import documentsModel from "../documents-model.js";
//This is where the magic happens. Instead of creating a new model which we then export, we instead call upon
//the parent model, and use discriminator to add a discriiminator whose reference name for labeling/ otherstuff and populating and things
// and whose schema for this sub system follows the reply schema we just described/ established.
const repliesModel = documentsModel.discriminator('Reply', replySchema);
//model is still a new model, jsut one based off of another in the same established colleciton, instead of off of the royal mongoose model thingy.
export default repliesModel;