import type { IFeedbackRepository, Feedback, CreateFeedbackDTO } from '../types'
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

        console.log("Feedback saved in memory", feedbackEntry)
        return feedbackEntry
    }

    findAll = async (): Promise<Feedback[]> => {
        return this.feedbackStore
    }

    findByProject = async (projectId: string): Promise<Feedback[]> => {
        return this.feedbackStore.filter(f => f.projectId === projectId)
    }
}
