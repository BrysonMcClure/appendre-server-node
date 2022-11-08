import mongoose from "mongoose";

export const options = {discriminatorKey: 'users'};
//{timestamps: true} what is this, a neccessary step for using the timestamp feature we want to use for password changes maybe?
const usersSchema = mongoose.Schema(
    {
        username: String,
        password: String,
        profilePic: String,
        role: String,
        language: String //One of French or English, not sure if we define that relationship here, need to fully flesh this feature out, just leaving it here for now for future test docuemnts
    }, options);
export default usersSchema;

//Note image is going to be a seperate side quest withuploading and storing images in mongo using something called multer
//For now just going to add a spot for it in the schema as this property profile pic, with the general idea being that you have
//something called a Buffer, a custome object/ primitave type I am not familiar with but seems to be built in,
//And then contentType being a string.