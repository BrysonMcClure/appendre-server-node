import mongoose from "mongoose";

//Determines name of collection on mongo DB i do believe
export const options = {discriminatorKey: 'documents'}

const documentSchema = mongoose.Schema(
    {
        title: String,
        text: String,
        date: Date,
        likes: Number,
        dislikes: Number
    }, options);
export default documentSchema;