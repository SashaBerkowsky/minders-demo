import type { Project } from '../entities/project'

export interface IProjectRepository {
    seed(): void
    findById(id: string): Promise<Project | undefined>
    findAll(): Promise<Project[]>
}
