import { NextFunction, Request, Response } from "express";
import { QueryResult } from "pg";
import { iDeveloper, iDeveloperGetResult, iDeveloperInfo, iDeveloperInfoRequest, iProject } from "./interfaces";
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
            *
        FROM
            projects
        WHERE
            id = $1;
    `

    const queryResult: QueryResult<iProject> = await client.query(queryString, [projectId])

    if(queryResult.rowCount > 0){
        response.locals.project = queryResult.rows[0]
        return next()
    }

    return response.status(404).json({message: 'Project not found.'})
}