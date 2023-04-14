import express, { Application } from "express";
import "dotenv/config";
import { checkOSList, checkTechIdAndProjectId, ensureDeveloperIdExists, ensureDeveloperInfoDoesNotExist, ensureEmailDoesNotExist, ensureIdExists, ensureProjectIdExists, getTechId } from "./middlewares";
import { deleteDeveloper, deleteProject, developerRegister, getDeveloper, getProject, postDeveloperInfo, postProject, postTechnologieInAProject, updateNameEmail, updateProject } from "./logics";

const app: Application = express();
app.use(express.json())

//DEVELOPERS ROUTES
app.post('/developers', ensureEmailDoesNotExist, developerRegister)
app.get('/developers/:id', ensureIdExists, getDeveloper)
app.patch('/developers/:id', ensureIdExists, ensureEmailDoesNotExist, updateNameEmail)
app.delete('/developers/:id', ensureIdExists, deleteDeveloper)
app.post('/developers/:id/infos', ensureIdExists, checkOSList, ensureDeveloperInfoDoesNotExist, postDeveloperInfo)

//PROJECTS & TECHNOLOGIES ROUTES
app.post('/projects', ensureDeveloperIdExists, postProject)
app.get('/projects/:id', ensureProjectIdExists, getProject)
app.patch('/projects/:id', ensureProjectIdExists, ensureDeveloperIdExists, updateProject)
app.delete('/projects/:id', ensureProjectIdExists, deleteProject)
app.post('/projects/:id/technologies', ensureProjectIdExists, getTechId, checkTechIdAndProjectId, postTechnologieInAProject)
app.delete('/projects/:projectId/technologies/:techId', ensureProjectIdExists, deleteProject)

export default app;
