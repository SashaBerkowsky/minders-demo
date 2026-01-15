import { feedbackRepository } from '../repository/feedback'
import { CreateFeedbackDTO, Feedback } from '../types'

export class FeedbackService {
    async createFeedback(feedbackData: CreateFeedbackDTO): Promise<Feedback> {
        if (feedbackData.rating < 1 || feedbackData.rating > 5) {
            throw new Error('Rating must be an integer between 1 and 5.')
        }

        const timestampDate = new Date(feedbackData.timestamp)
        if (isNaN(timestampDate.getTime())) {
            throw new Error('Invalid timestamp provided.')
        }

        console.log(`[FeedbackService]: Processing submission for Project: ${feedbackData.projectId}`)

        return await feedbackRepository.save(feedbackData);
    }

    async getProjectFeedback(projectId: string): Promise<Feedback[]> {
        if (!projectId) {
            throw new Error('Project ID is required to fetch feedback.')
        }

        return await feedbackRepository.findByProject(projectId)
    }
}

export const feedbackService = new FeedbackService()
