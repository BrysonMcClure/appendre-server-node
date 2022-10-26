import mongoose from 'mongoose';
import usersSchema from "./users-schema.js";
const userModel = mongoose.model('User', usersSchema);
export default userModel;