import lettersModel from "./letter-model.js";

export const findAllLetters = () => lettersModel.find();
export const findLettersByAttribute = (attribute, value) => lettersModel.find({attribute: value});
export const createLetter = (newLetter) => lettersModel.create(newLetter);
export const deleteLetter = (lid) => lettersModel.deleteOne({_id: lid});
export const updateLetter = (lid, letter) => lettersModel.updateOne({_id: lid}, {$set: letter});
export default {findAllLetters, findLettersByAttribute, createLetter, deleteLetter, updateLetter};