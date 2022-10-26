import mongoose from "mongoose";

export const options = {discriminatorKey: 'letters'};
//Sticking with discrimiator pattern for now even though its theoretically not strictly neccessary
//mainly because this is familiar but also because it then offers us expansion opporunities for the future
//if we decide to have different types of letters

const letterSchema = mongoose.Schema(
    {
        title: String,
        text: String,
        tags: [String], //we can just do this I believe
        date: Date, //May not be needed and instead can just use getTimeStamp functionality to just print out time record was added/ last time text field was edited on client side
        likes: Number,
        dislikes: Number,
        replies: [{type: mongoose.Schema.Types.ObjectId, ref:'Reply'}],
        author: {type: mongoose.Schema.Types.ObjectId, ref: 'PenUser'} //This will also then help serve as a proof of concept for our friends list, this will be the friend you can add maybe from the document.
        //Changing to be specifically a pen user type, not user, not sure if this is the way to go or if we want to be using parent, idk
    }, options);
export default letterSchema;
