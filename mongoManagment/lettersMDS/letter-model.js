import mongoose from "mongoose";
import letterSchema from "./letter-schema.js";
const lettersModel = mongoose.model('Letter', letterSchema);
export default lettersModel;