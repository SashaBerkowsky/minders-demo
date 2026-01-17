import type { IFeedbackRepository, Feedback } from '@domain'
import type { CreateFeedbackDTO } from './dtos/CreateFeedbackDTO'

export class SubmitFeedbackUC {
    private feedbackRepository: IFeedbackRepository

    constructor(repository: IFeedbackRepository) {
        this.feedbackRepository = repository
    }

    execute = async (feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> => {
        return await this.feedbackRepository.save(feedbackData, projectId);
    }
}
