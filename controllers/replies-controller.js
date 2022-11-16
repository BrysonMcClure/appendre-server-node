import repliesDao from "../mongoManagment/documentsMDS/repliesMDS/replies-dao.js";
import palsDao from "../mongoManagment/palsMDS/pals-dao.js";
import usersDao, {updateUser} from "../mongoManagment/usersMDS/users-dao.js";

const repliesController = (app) => {
    // app.get('/api/replies', findAllReplies);
    // app.get('/api/replies/:attribute/:value', findRepliesByAttribute);
    // app.get('/api/replies/:rid', findReplyById);
    //If the id is in the http request, then it has to be defined, else req won't hit right? I'm pretty sure.
    app.post('/api/replies/:aid/replyTo/:lid', createReply);
    // app.delete('/api/replies/:lid', deleteLetter);
    // app.put('/api/replies/:lid', updateLetter);
}

export default repliesController;
//replying to something, is also creating a reply, so while maybe a little confusing, I think my terminology may actualyl make sense here.
const createReply = async (req, res) => {
    const newReply = req.body;
    //Have to initialize these here since it is where we have access to req. Based on some of his examples I do believe
    //This way with ids in parth params is probably the way to do this.
    newReply.author = req.params.aid;
    //becuase its an id at this stage, not an object, populate handles that later.
    newReply.parentLetter = req.params.lid;
    //responsibility of adding this to the document go where? I was thinking here by calling the dao, but im
    //starting to think not since that would fall under an update req. so hmmmmmmm
    const insertedReply = await repliesDao.createReply(newReply);

    //Whenever creating a reply, the author should also be update with a reference to the reply they just wrote.
    //Add a reference to this reply to the pal author of this reply
    const author = palsDao.findUserById(aid);
    author.replies.push(insertedReply._id);
    const responsee = updateUser(aid, author);

    res.json(insertedReply);
}