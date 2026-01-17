import type { IProjectRepository, Project } from '@domain'
import type { CreateProjectDTO } from '@application'

export class LocalProjectRepository implements IProjectRepository {
    private projectStore: Project[] = []

    findAll = async (): Promise<Project[]> => {
        return this.projectStore
    }

    seed = () => {
        const seed: CreateProjectDTO[] = [
            { name: "MELI", description: "MELI sample desc" },
            { name: "Uala", description: "Uala sample desc" },
            { name: "Cocos", description: "Cocos sample desc" },
        ]

        seed.forEach(p => this.save(p))
    }

    findById = async (id: string) => {
        return this.projectStore.find(p => p.id === id) || undefined
    }

    private async save(projectData: CreateProjectDTO): Promise<Project> {
        const projectEntry: Project = {
            ...projectData,
            id: String(this.projectStore.length),
            apiKey: `minders_secret_key_${this.projectStore.length}`
        }

        this.projectStore.push(projectEntry)

        return projectEntry
    }
}
