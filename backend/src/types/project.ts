export interface Project {
    id: string
    name: string
    description: string
    apiKey: string
}

export type CreateProjectDTO = Omit<Project, 'id' | 'apiKey'>
