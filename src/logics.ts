import { Request, Response } from "express";
import { iDeveloper, iDeveloperGetResult, iDeveloperInfo, iDeveloperInfoRequest, iProject, tDeveloperRegisterRequest, tProjectPostRequest, tTechnologies } from "./interfaces";
import format from "pg-format";
import { QueryConfig, QueryResult } from "pg";
import { client } from "./database";

export const developerRegister = async (request: Request, response: Response): Promise<Response> => {

    const devData: tDeveloperRegisterRequest = request.body

    const queryString: string = format(`
        INSERT INTO 
            developers(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
        Object.keys(devData),
        Object.values(devData)
    )
    
    const queryResult: QueryResult<iDeveloper> = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}

export const getDeveloper = async (request: Request, response: Response): Promise<Response> => {

    const devId: number = Number(request.params.id)

    const queryString: string = `
        SELECT
            dev.id "developerId",
            dev.name "developerName",
            dev.email "developerEmail",
            devInf."developerSince" "developerInfoDeveloperSince",
            devInf."preferredOS" "developerInfoPreferredOS"
        FROM
            developers dev
        LEFT JOIN
            developer_infos devInf ON dev."id" = devInf."developerId"
        WHERE
            dev."id" = $1;
    `
    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    }

    const queryResult: QueryResult<iDeveloperGetResult> = await client.query(queryConfig)
    

    return response.status(200).json(queryResult.rows[0])
}

export const updateNameEmail = async (request: Request, response: Response): Promise<Response> => {

    const devId: number = Number(request.params.id)
    const newData: Partial<iDeveloper> = request.body

    const queryString: string = format(`
        UPDATE 
            developers
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
    Object.keys(newData),
    Object.values(newData)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    }
    const queryResult: QueryResult<iDeveloper> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const deleteDeveloper = async (request: Request, response: Response): Promise<Response> => {

    const devId: number = Number(request.params.id)

    const queryString: string = `
        DELETE FROM
            developers
        WHERE
            id = $1
    `

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [devId]
    }

    await client.query(queryConfig)

    return response.status(204).send()
}

export const postDeveloperInfo = async (request: Request, response: Response): Promise<Response> => {

    const devId: number = Number(request.params.id)
    const data: iDeveloperInfoRequest = request.body

    const newData: Partial<iDeveloperInfo> = {
        ...data,
        developerId: devId
    }

    const queryString: string = format(`
        INSERT INTO
            developer_infos(%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(newData),
    Object.values(newData)
    )

    const queryResult: QueryResult<iDeveloperInfo> = await client.query(queryString)


    return response.status(201).json(queryResult.rows[0])
}

export const postProject = async (request: Request, response: Response): Promise<Response> => {

    const projectData: tProjectPostRequest = request.body

    const queryString: string = format(`
        INSERT INTO
            projects (%I)
        VALUES
            (%L)
        RETURNING *;
    `,
    Object.keys(projectData),
    Object.values(projectData)
    )

    const queryResult: QueryResult<iProject> = await client.query(queryString)

    return response.status(201).json(queryResult.rows[0])
}

export const getProject = async (request: Request, response: Response): Promise<Response> => {

    const project: iProject = response.locals.project

    return response.status(200).json(project)
}

export const updateProject = async (request: Request, response: Response): Promise<Response> => {

    const data: tProjectPostRequest = request.body
    const projectId: number = Number(request.params.id)
    console.log(data)
    console.log(projectId)

    const queryString: string = format(`
        UPDATE
            projects
        SET
            (%I) = ROW(%L)
        WHERE
            id = $1
        RETURNING *;
    `,
    Object.keys(data),
    Object.values(data)
    )

    const queryConfig: QueryConfig = {
        text: queryString,
        values: [projectId]
    }

    const queryResult: QueryResult<iProject> = await client.query(queryConfig)

    return response.status(200).json(queryResult.rows[0])
}

export const deleteProject = async (request: Request, response: Response): Promise<Response> => {

    const id: number = Number(request.params.id)

    const queryString: string = `
        DELETE FROM
            projects
        WHERE
            id = $1
    `

    await client.query(queryString, [id])

    return response.status(204).send()
}
export const postTechnologieInAProject = async (request: Request, response: Response): Promise<Response> => {

    return response
}