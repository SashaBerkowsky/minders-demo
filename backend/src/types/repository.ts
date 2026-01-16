import type { Feedback, CreateFeedbackDTO } from './feedback'

export interface IFeedbackRepository {
    save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback>
    findAll(): Promise<Feedback[]>
    findByProject(projectId: string): Promise<Feedback[]>
}

