import mongoose from 'mongoose';
import penUserSchema from '../pensMDS/pens-schema.js'
import userModel from "../usersMDS/users-model.js";
const penUserModel = userModel.discriminator('PenUser', penUserSchema);
export default penUserModel;