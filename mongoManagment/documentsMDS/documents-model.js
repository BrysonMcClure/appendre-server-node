import mongoose from "mongoose";
import documentSchema from "./document-schema.js";
const documentsModel = mongoose.model('Document', documentSchema);
export default documentsModel;