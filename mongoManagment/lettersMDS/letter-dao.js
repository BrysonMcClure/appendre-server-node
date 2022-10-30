import lettersModel from "./letter-model.js";

export const findAllLetters = () => lettersModel.find().populate('author');
export const findLettersByAttribute = (attribute, value) => lettersModel.find({attribute: value});
export const findLetterById = async (lid) => {
    //difference between find and findone is just find the first instance vs all matching instances maybe me thinks??
    const response = await lettersModel.findOne({_id: lid}).populate('author');
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
    const returnValue = await  response.populate('author');
    return returnValue;
}
export const deleteLetter = (lid) => lettersModel.deleteOne({_id: lid});
export const updateLetter = (lid, letter) => lettersModel.updateOne({_id: lid}, {$set: letter});
export default {findAllLetters, findLettersByAttribute, findLetterById, createLetter, deleteLetter, updateLetter};