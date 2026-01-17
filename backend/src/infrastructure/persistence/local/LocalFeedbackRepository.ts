import type { IFeedbackRepository, Feedback } from '@domain'
import type { CreateFeedbackDTO } from '@application'
import { randomUUID } from 'crypto'

export class LocalFeedbackRepository implements IFeedbackRepository {
    private feedbackStore: Feedback[] = []

    save = async (feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> => {
        const feedbackEntry: Feedback = {
            ...feedbackData,
            id: randomUUID(),
            createdAt: new Date(),
            projectId
        }

        this.feedbackStore.push(feedbackEntry)

        return feedbackEntry
    }

    findAll = async (): Promise<Feedback[]> => {
        return this.feedbackStore
    }
}
