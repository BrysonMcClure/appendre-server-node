import letterDao from "../mongoManagment/lettersMDS/letter-dao.js";
import profile from "../controllers/authentication-controller.js"
import usersDao from "../mongoManagment/usersMDS/users-dao.js";

const lettersController = (app) => {
    app.get('/api/letters', findAllLetters);
    //Not sure on this one yet, how do key value pairs over just path params? Would that be better?
    app.get('/api/letters/attributeSearch', findLettersByAttribute);
    app.get('/api/letters/:lid', findLetterById);
    app.post('/api/letters/:aid', createLetter);
    app.delete('/api/letters/:lid', deleteLetter);
    app.put('/api/letters/:lid', updateLetter);
}

const findAllLetters = async (req, res) => {
    const letters = await letterDao.findAllLetters();
    res.json(letters);
}

const findLettersByAttribute = async (req, res) => {
    //Just sending ok for now, functionality tbd
    const queryObject = req.query;
    //For now just doing the first one in the array. Could make this multiple in the future if needed, may
    //need to protect against undefined case for rouge link seekers.
    //See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
    const [key, value] = Object.entries(queryObject)[0];
    let filter;
    switch (key) {
        case "title":
            filter = { title : { $regex: value, $options: 'i' } };
            break;
        case "text":
            filter = { text : { $regex: value, $options: 'i' } };
            break;
        case "author":
            //will only find one, need to make this multiple maybe.
            const author = await usersDao.findUserByUsername(value);
            // for (const author in matchedAuthors) {
            //
            // }
            //res.json(author);
            // ({"author" : })
            filter = { author : author._id};
            break;
        // case "date": Making this a search ordering filter later maybe, not a search criteria since i think it makes more sense that way. Also its difficult.
        //     filter = { date : { $regex: value, $options: 'i' } };
        //     break;
        default:
            filter = null;
    }

    //const filter =
    if(filter) {
        const letters = await letterDao.findLettersByAttribute(filter);
        res.json(letters);
        return;
    }
    res.send(200);

}

const findLetterById = async (req, res) => {
    const letterId = req.params.lid;
    const letter = await letterDao.findLetterById(letterId);
    res.json(letter);
}

const createLetter = async (req, res) => {
    const newLetter = req.body;
    //getting passed an author id now by the service. Is this better?
    newLetter.author = req.params['aid'];
    // //Is this an ok practice calling on other controllers like this to access the session?
    // const authoringUser = await profile();
    // newLetter.author = authoringUser._id;
    const insertedLetter = await letterDao.createLetter(newLetter);
    res.json(insertedLetter);
}

const deleteLetter = async (req, res) => {
    const lidToDelete = req.params['lid'];
    const status = await letterDao.deleteLetter(lidToDelete);
    res.send(status);
}

const updateLetter = async (req, res) => {
    const lidToUpdate = req.params['lid'];
    const updatedLetter = req.body;
    const status = await letterDao.updateLetter(lidToUpdate, updatedLetter);
    res.send(status);
}

export default lettersController;