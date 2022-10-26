import mongoose from "mongoose";
import palUsersSchema from "./pals-schema.js";
import userModel from "../usersMDS/users-model.js";
const palUserModel = userModel.discriminator('PalUser', palUsersSchema);
export default palUserModel;