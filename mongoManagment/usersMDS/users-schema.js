import mongoose from "mongoose";
const schema = mongoose.Schema(
    {
        username: String,
        password: String
    }, {collection: 'users'});
export default schema;