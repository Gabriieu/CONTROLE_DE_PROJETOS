import { NextFunction, Request, Response, request } from "express";
import { QueryConfig, QueryResult } from "pg";
import { iDeveloper, iDeveloperGetResult, iDeveloperInfo, iDeveloperInfoRequest, iProject, iProjectTechnologies } from "./interfaces";
import { client } from "./database";

export const ensureEmailDoesNotExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const email: string = request.body.email

    const queryString: string = `
        SELECT
            *
        FROM
            developers
        WHERE 
            email = $1;
    `

    const queryResult: QueryResult<iDeveloper> = await client.query(queryString, [email])

    if(queryResult.rowCount !== 0){
        return response.status(409).json(
            {message: 'Email already exists.'}
        )
    }

    response.locals.developer = queryResult.rows[0]

    return next()
}

export const ensureIdExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const devId: number = Number(request.params.id)

    const queryString: string = `
        SELECT
            *
        FROM
            developers
        WHERE
            id = $1;
    `

    const queryResult: QueryResult<iDeveloperGetResult> = await client.query(queryString, [devId])
    

    if(queryResult.rowCount === 0){
        return response.status(404).json(
            {message: 'Developer not found'}
        )
    }

    return next()
}

export const ensureDeveloperInfoDoesNotExist = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const devId: number = Number(request.params.id)

    const queryString: string = `
        SELECT
            *
        FROM
            developer_infos
        WHERE
            "developerId" = $1
    `

    const queryResult: QueryResult<iDeveloperInfo> = await client.query(queryString, [devId])
    
    if(queryResult.rowCount > 0){
        if(queryResult.rows[0].preferredOS !== null || queryResult.rows[0].developerSince !== null){
            return response.status(409).json({message: "Developer infos already exists."})
        }
    }

    return next()
}

export const checkOSList = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const OSlist = ["Windows", "Linux", "MacOS"]
    const data: iDeveloperInfoRequest = request.body

    if(!OSlist.includes(data.preferredOS)){
        return response.status(400).json({
            message: "Invalid OS option.",
            options: OSlist
        })
    }

    return next()
}

export const ensureDeveloperIdExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const {developerId} = request.body

    const queryString: string = `
        SELECT
            *
        FROM
            developers
        WHERE
            id = $1;
    `

    const queryResult: QueryResult<iDeveloper> = await client.query(queryString, [developerId])

    if(queryResult.rowCount > 0){
        return next()
    }

    return response.status(404).json({message: 'Developer not found.'})

    
}

export const ensureProjectIdExists = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const projectId: number = Number(request.params.id)

    const queryString: string = `
        SELECT
            p."id" "projectId",
            p."name" "projectName",
            p."description" "projectDescription",
            p."estimatedTime" "projectEstimatedTime",
            p."repository" "projectRepository",
            p."startDate" "projectStartDate",
            p."endDate" "projectEndDate",
            p."developerId" "projectDeveloperId",
            t.id "technologyId",
            t.name "technologyName"
        FROM
            projects p
        FULL JOIN
            projects_technologies pt ON pt."projectId" = p.id
        FULL JOIN
            technologies t ON t.id = pt."technologyId"
        WHERE
            p.id = $1;
    `

    const queryResult: QueryResult<iProject> = await client.query(queryString, [projectId])

    if(queryResult.rowCount > 0){
        response.locals.project = queryResult.rows
        return next()
    }

    return response.status(404).json({message: 'Project not found.'})
}

export const getTechIdBody = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const techList = ['JavaScript','Python','React','Express.js','HTML','CSS','Django','PostgreSQL', 'MongoDB']
    const tech: string = request.body.name
    
    const queryString: string = `
        SELECT
            t.id
        FROM
            technologies t
        WHERE
            name = $1;
    `

    const queryResult: QueryResult = await client.query(queryString, [tech])

    if(queryResult.rowCount === 0){
        return response.status(400).json({
            message: 'Technology not supported.',
            options: techList
        })
    }

    response.locals.techId = queryResult.rows[0].id

    return next()
}

export const checkTechIdAndProjectId = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const techId: number = response.locals.techId
    const projectId: number = Number(request.params.id)

    const queryString: string = `
        SELECT 
            *
        FROM
            projects_technologies
        WHERE "technologyId" = $1 AND "projectId" = $2; 
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [techId, projectId]
    }

    const queryResult: QueryResult<iProjectTechnologies> = await client.query(queryConfig)

    if(queryResult.rowCount > 0){
        return response.status(409).json({message: `${request.body.name} technology is already associated with the project`})
    }

    return next()
}

export const getTechIdParams = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const techList = ['JavaScript','Python','React','Express.js','HTML','CSS','Django','PostgreSQL', 'MongoDB']
    const techName: string = request.params.techName

    const queryString: string = `
        SELECT
            t.id
        FROM
            technologies t
        WHERE
            t."name" = $1
    `

    const queryResult: QueryResult = await client.query(queryString, [techName])

    console.log(queryResult.rows[0])
    if(queryResult.rowCount === 0){
        return response.status(400).json({
            message: 'Technology not supported.',
            options: techList
        })
    }

    response.locals.techId = queryResult.rows[0].id

    return next()
}

export const ensureTechIsInTheProject = async (request: Request, response: Response, next: NextFunction): Promise<Response | void> => {

    const techId = response.locals.techId
    const projectId: number = Number(request.params.id)

    const queryString: string = `
        SELECT
            *
        FROM
            projects_technologies pt
        WHERE
            pt."technologyId" = $1 AND pt."projectId" = $2;
    `

    const queryResult: QueryResult = await client.query(queryString, [techId, projectId])

    if(queryResult.rowCount === 0){
        return response.status(400).json({message: 'Technology not related to the project.'})
    }

    return next()
}
