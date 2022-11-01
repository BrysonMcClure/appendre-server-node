import repliesModel from "./replies-model.js";

export const createReply = async (newReply) => {
    //Parent constructor doesnt get called for us does it? i dont think so, im fine doubling up on the repeated stuff here though.
    newReply.likes = 0;
    newLetter.dislikes = 0;
    newLetter.date = new Date();
    const createdReply = await repliesModel.create(newReply);
    //creating letter first with provided IDs and things, and then calling populate on it once the ID is established.
    const populatedLetter = createdReply.populate('parentLetter');
    //Title = document parent prop, populated by force to be a re: parentLetter title
    //Write way to do string combine here?
    populatedLetter.title = "Re: " + populatedLetter.parentLetter.title;
    //Sufficient to do this? or do we then need to call update one with the new "modified thing we just did"
    //Not sure yet NEED TO REMEMEBER TO CHECK MODEL AFTER IMPLEMENTING THIS TO MAKE SURE REPLIES AND ALL THEIR ATTRIBUTES,
    //ESPECIALLY TITLE ARE GETTING POPULATED CORRECTLY
    return populatedLetter;
}

export default {createReply};