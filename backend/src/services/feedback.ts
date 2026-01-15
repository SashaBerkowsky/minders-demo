import { feedbackRepository } from '../repository/feedback'
import { CreateFeedbackDTO, Feedback } from '../types'

export class FeedbackService {
    async createFeedback(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> {

        return await feedbackRepository.save(feedbackData, projectId);
    }

    async getProjectFeedback(projectId: string): Promise<Feedback[]> {
        if (!projectId) {
            throw new Error('Project ID is required to fetch feedback.')
        }

        return await feedbackRepository.findByProject(projectId)
    }
}

export const feedbackService = new FeedbackService()
