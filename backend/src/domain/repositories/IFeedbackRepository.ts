import type { Feedback } from '../entities/feedback'
import type { CreateFeedbackDTO } from '@application'

export interface IFeedbackRepository {
    save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback>
    findAll(): Promise<Feedback[]>
}
