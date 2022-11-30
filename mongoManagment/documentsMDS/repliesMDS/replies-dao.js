import repliesModel from "./replies-model.js";

export const createReply = async (newReply) => {
    //Parent constructor doesnt get called for us does it? i dont think so, im fine doubling up on the repeated stuff here though.
    newReply.likes = 0;
    newReply.dislikes = 0;
    newReply.date = new Date();
    newReply.replies = [];
    const createdReply = await repliesModel.create(newReply);
    //creating letter first with provided IDs and things, and then calling populate on it once the ID is established.
    //ye best be awaiting populate if ye be wanting to use its result any time soon argggggggggg.
    const populatedReply = await createdReply.populate('parentLetter');
    //Title = document parent prop, populated by force to be a re: parentLetter title
    //Write way to do string combine here?
    const replyParentLetterTitle = populatedReply.parentLetter.title;
    //gonna probably have to run an update here to have this take effect.
    populatedReply.title = `Re: ${replyParentLetterTitle}`;
    //Sufficient to do this? or do we then need to call update one with the new "modified thing we just did"
    //Not sure yet NEED TO REMEMEBER TO CHECK MODEL AFTER IMPLEMENTING THIS TO MAKE SURE REPLIES AND ALL THEIR ATTRIBUTES,
    //ESPECIALLY TITLE ARE GETTING POPULATED CORRECTLY
    return populatedReply;
}

export const updateReply = async (rid, reply) => {
    //I think this should work. Havent used findbyidandupdate yet, but theoretically should work the same as passing id
    //as the filter argument, just a little less verbose right?
    const status = await repliesModel.findByIdAndUpdate(rid, {$set: {
            feedback: reply.feedback,
            troubleWords: reply.troubleWords
        }});
    return status;
}

export const unpopulatedFindReplyById = async (rid) => {
    const reply = await repliesModel.findById(rid);
    return reply;
}

export default {createReply, updateReply, unpopulatedFindReplyById};