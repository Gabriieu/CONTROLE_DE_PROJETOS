import express, { Application } from "express";
import "dotenv/config";
import { checkOSList, ensureDeveloperIdExists, ensureDeveloperInfoDoesNotExist, ensureEmailDoesNotExist, ensureIdExists, ensureProjectIdExists } from "./middlewares";
import { deleteDeveloper, developerRegister, getDeveloper, getProject, postDeveloperInfo, postProject, updateNameEmail } from "./logics";

const app: Application = express();
app.use(express.json())

//DEVELOPERS ROUTES
app.post('/developers', ensureEmailDoesNotExist, developerRegister)
app.get('/developers/:id', ensureIdExists, getDeveloper)
app.patch('/developers/:id', ensureEmailDoesNotExist, ensureIdExists, updateNameEmail)
app.delete('/developers/:id', ensureIdExists, deleteDeveloper)
app.post('/developers/:id/infos', ensureIdExists, checkOSList, ensureDeveloperInfoDoesNotExist, postDeveloperInfo)

//PROJECTS ROUTES
app.post('/projects', ensureDeveloperIdExists, postProject)
app.get('/projects/:id', ensureProjectIdExists, getProject)

export default app;
