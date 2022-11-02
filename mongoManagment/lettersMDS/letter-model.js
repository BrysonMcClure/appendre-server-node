import mongoose from "mongoose";
import letterSchema from "./letter-schema.js";
import documentsModel from "../documentsMDS/documents-model.js";
const lettersModel = documentsModel.discriminator('Letter', letterSchema);
export default lettersModel;