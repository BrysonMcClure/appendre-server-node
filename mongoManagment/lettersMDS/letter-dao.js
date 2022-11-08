import lettersModel from "./letter-model.js";
//call letterDocument like penUser? IDK maybe feels a little pedantic still or something. IDK.
export const findAllLetters = () => lettersModel.find().populate('author').populate('replies');
export const findLettersByAttribute = (filter) => lettersModel.find(filter).populate('author').populate('replies');;
export const findLetterById = async (lid) => {
    //change to: await lettersModel.findById(lid).populate('author').populate('replies');
    //Didnt realize this was built in thing, but good to know it exists, may try this later, for now a few too many variables/ things changing right now.
    //difference between find and findone is just find the first instance vs all matching instances maybe me thinks??
    const response = await lettersModel.findOne({_id: lid}).populate('author').populate('replies');
    return response;
}
export const createLetter = async (newLetter) => {
    //Setting default values
    newLetter.likes = 0;
    newLetter.dislikes = 0;
    newLetter.date = new Date();
    //Theoretically and in it should pratcie, creating a letter with an undefined author is an impossibble case we should not need to cover
    //Should be an implied return since create call returns something. Populate operates on return value, not
    //On create method itself thus not affecting/effecting what gets added to the data base, just what our
    //controller reses back to the client/ which what/ what which ultimately ends up in the reducer, which
    //was causing the error I believe
    const response = await lettersModel.create(newLetter);
    //Do it this way so a local reducer copy is getting the most uptodate object with properly populated fields. Basically
    //I think anytime we return anything to user/client facing side we want to make sure we are populating first. For inward facing mongoose model stuff the ID prop is the default
    // / and is fine/ actually prefered since it is what the thingy/model wants anyway
    //Was having an issue with this. not sure if it was a real problem of a one off as it seemed to just cropup the once,
    //But long story short am no longer calling populate on the replies at this stage, since we know its empty. Not sure though
    //if thats actually the problem. DOesnt really matter though since our rending logic guards against/ allows for
    //the empty replies case anyway, also the pupulate in our find all didnt seem to mind, so IDK?
    const returnValue = await  response.populate('author');
    return returnValue;
}
export const deleteLetter = (lid) => lettersModel.deleteOne({_id: lid});
export const updateLetter = (lid, letter) => lettersModel.updateOne({_id: lid}, {$set: letter});
export default {findAllLetters, findLettersByAttribute, findLetterById, createLetter, deleteLetter, updateLetter};