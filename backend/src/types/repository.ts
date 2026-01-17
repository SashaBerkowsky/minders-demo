import type { Feedback, CreateFeedbackDTO } from './feedback'
import type { Project } from './project'

export interface IFeedbackRepository {
    save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback>
    findAll(): Promise<Feedback[]>
}

export interface IProjectRepository {
    seed(): void
    findById(id: string): Promise<Project>
    findAll(): Promise<Project[]>
}

