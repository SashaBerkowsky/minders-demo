import { CreateFeedbackDTO, Feedback, IFeedbackRepository } from '../types'

export class FeedbackService {
    private feedbackRepository: IFeedbackRepository

    constructor(repository: IFeedbackRepository) {
        this.feedbackRepository = repository
    }

    createFeedback = async (feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> => {
        return await this.feedbackRepository.save(feedbackData, projectId);
    }

    getProjectFeedback = async (projectId: string): Promise<Feedback[]> => {
        if (!projectId) {
            throw new Error('Project ID is required to fetch feedback.')
        }

        return await this.feedbackRepository.findByProject(projectId)
    }
}
