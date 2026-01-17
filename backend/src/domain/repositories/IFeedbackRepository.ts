import type { Feedback } from '../entities/Feedback'
import type { CreateFeedbackDTO } from '@application'

export interface IFeedbackRepository {
    save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback>
    findAll(): Promise<Feedback[]>
}
