import lettersModel from "./letter-model.js";
//call letterDocument like penUser? IDK maybe feels a little pedantic still or something. IDK.
export const findAllLetters = () => lettersModel.find().populate('author').populate('replies');
export const findLettersByAttribute = (filter) => lettersModel.find(filter).populate('author').populate('replies');
export const findLetterById = async (lid) => {
    //change to: await lettersModel.findById(lid).populate('author').populate('replies');
    //Didnt realize this was built in thing, but good to know it exists, may try this later, for now a few too many variables/ things changing right now.
    //difference between find and findone is just find the first instance vs all matching instances maybe me thinks??
    //I think we can just do this right? After you populate the replies, theoretically I can just then path populate it right? Since now its an object wit sub populatable stuff now right?
    //Idk that may just break everything and we may want to use a sub deep population that we call on the replies schema to exectue. Not sure about that for now.
    // const response = await lettersModel.findOne({_id: lid}).populate('author').populate(
    //     {path: 'replies', populate: {path: 'author'}}).populate({path: 'replies', populate: {path: 'feedback.author'}});
    const response = await lettersModel.findOne({_id: lid}).populate('author').populate(
        {path: 'replies', populate: [{path: 'author'}, {path: 'feedback.author'}]});
    //DOuble populate doesnt seem to have any problems with repating replies popoulate once its resultant is no longer jsut an id array. i guess it must nknow that somehow, eitherway it doesnt
    //really seem to be causing any problems so that's nice. Seems like you can put multipble same level populates in an array, not surre if thats neccessarily any more conise or anything exactly hmmm?,
    //oh wait, unless, that same level thing makes me wonder, hmmm, same level of foreign document for replies, even if path is a level deeper maybe, i think for the levels we are talking about it may actually befine/ work nicely in that way
    //to help make things a little more compact and concise maybe ehh, ioether way I think this is nicer than having to call out to the other reducer which could totally cause cyclical population issues,
    //and what's more this case kind of being supported by default in mongoose/ by mongoose in default implies this is maybve a very valid approabch, i would say good but what is good/ best any way ehhh?
    //const returnTest = await response.populate('replies.author');
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
    //we populate but never tell the autor right? I think that tracks thinking about/ considering the fact
    //that until recently we didnt have a way to update uesrs period even from/ at the dao level, so that would track right?

    const returnValue = await  response.populate('author');
    return returnValue;
}
export const deleteLetter = async (lid) => {
    const response = await lettersModel.deleteOne({_id: lid});
    return response;
}
export const updateLetter = (lid, letter) => lettersModel.updateOne({_id: lid}, {$set: letter});
export const addReply = async (lid, rid) => {
    const response = await lettersModel.findByIdAndUpdate(lid, { $push: { replies: rid } });
    return response;
}
export default {findAllLetters, findLettersByAttribute, addReply, findLetterById, createLetter, deleteLetter, updateLetter};