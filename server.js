import express from 'express';
import sessionController from "./controllers/session-controller.js";
const app = express();
app.use(express.json());
sessionController(app);
//Make this an env variable later
app.listen(4000);