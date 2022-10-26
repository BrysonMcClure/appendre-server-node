import letterDao from "../mongoManagment/lettersMDS/letter-dao.js";

const lettersController = (app) => {
    app.get('/api/letters', findAllLetters);
    //Not sure on this one yet, how do key value pairs over just path params? Would that be better?
    app.get('/api/letters/:attribute/:value', findLettersByAttribute);
    app.post('/api/letters', createLetter);
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

const createLetter = async (req, res) => {
    const newLetter = req.body;
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