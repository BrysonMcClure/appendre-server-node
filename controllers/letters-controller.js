import letterDao from "../mongoManagment/lettersMDS/letter-dao.js";
import profile from "../controllers/authentication-controller.js"

const lettersController = (app) => {
    app.get('/api/letters', findAllLetters);
    //Not sure on this one yet, how do key value pairs over just path params? Would that be better?
    app.get('/api/letters/:attribute/:value', findLettersByAttribute);
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