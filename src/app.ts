import express, { Application } from "express";
import "dotenv/config";
import { checkOSList, ensureDeveloperIdExists, ensureDeveloperInfoDoesNotExist, ensureEmailDoesNotExist, ensureIdExists, ensureProjectIdExists } from "./middlewares";
import { deleteDeveloper, deleteProject, developerRegister, getDeveloper, getProject, postDeveloperInfo, postProject, postTechnologieInAProject, updateNameEmail, updateProject } from "./logics";

const app: Application = express();
app.use(express.json())

//DEVELOPERS ROUTES
app.post('/developers', ensureEmailDoesNotExist, developerRegister)
app.get('/developers/:id', ensureIdExists, getDeveloper)
app.patch('/developers/:id', ensureEmailDoesNotExist, ensureIdExists, updateNameEmail)
app.delete('/developers/:id', ensureIdExists, deleteDeveloper)
app.post('/developers/:id/infos', ensureIdExists, checkOSList, ensureDeveloperInfoDoesNotExist, postDeveloperInfo)

//PROJECTS & TECHNOLOGIES ROUTES
app.post('/projects', ensureDeveloperIdExists, postProject)
app.get('/projects/:id', ensureProjectIdExists, getProject)
app.patch('/projects/:id', ensureProjectIdExists, ensureDeveloperIdExists, updateProject)
app.delete('/projects/:id', ensureProjectIdExists, deleteProject)
app.post('/projects/:id/technologies', ensureProjectIdExists, postTechnologieInAProject)

export default app;
