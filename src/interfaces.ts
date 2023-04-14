export interface iDeveloper {
    id: number
    name: string
    email: string
}

export type tDeveloperRegisterRequest = Omit<iDeveloper, "id">

export interface iDeveloperGetResult {
    developerId: number
    developerName: string
    developerEmail: string
    developerInfoDeveloperSince: string
    developerInfoPreferredOS: string
}

export interface iDeveloperInfo {
    id: number
    developerSince: Date
    preferredOS: string
    developerId: number
}

export interface iDeveloperInfoRequest {
    developerSince: Date
    preferredOS: string
}

export interface iProject {
    id: number
    name: string
    description: string
    estimatedTime: string
    repository: string
    startDate: Date
    endDate: Date
    developerId: number
}

export type tProjectPostRequest = Omit<iProject, "id">

export type tTechnologies = {
    id: number
    name: string
}

export interface iProjectTechnologies {
    id: number
    addedIn: Date
    technologyId: number
    projectId: number
}

export type tProjectTechnologiesRequest = Omit<iProjectTechnologies, "id">