import pensDao from "../mongoManagment/pensMDS/pens-dao.js";
import usersDao from "../mongoManagment/usersMDS/users-dao.js";

const penUsersController = (app) => {
    //app.put('/api/penUsers/peid', updatePenUser);
}


const updatePenUser = async (req, res) => {
    const penUserToUpdateId = req.params.peid;
    const updatePenUser = req.body;
    //No new object reutrned here, since server has no results to give and no change of editing the object like in create does with some defualt presets
    //so just get a status then it is up to reducer to handle parody
    //const status = await pensDao.updatePenUser(penUserToUpdateId, updatePenUser);
}

export default penUsersController;