import documentsModel from "./documents-model.js";

//What other crud operations should go here? hmmmm? not sure.
//export const findUserByUsername = (username) => userModel.find({username : username});
export const deleteDocument = (did) => documentsModel.deleteOne({_id: did});
export const findDocumentById = async (did) => documentsModel.findOne({_id : did});
export default {findDocumentById, deleteDocument};