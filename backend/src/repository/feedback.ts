import { Feedback, CreateFeedbackDTO } from '../types'
import { randomUUID } from 'crypto'

class FeedbackRepository {
    private feedbackStore: Feedback[] = []

    async save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> {
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

    async findAll(): Promise<Feedback[]> {
        return this.feedbackStore
    }

    async findByProject(projectId: string): Promise<Feedback[]> {
        return this.feedbackStore.filter(f => f.projectId === projectId)
    }
}

export const feedbackRepository = new FeedbackRepository()
