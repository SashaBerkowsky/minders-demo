import type { Feedback } from '../../domain'

export interface FeedbackRepository {
    send(feedback: Feedback, endpoint: string, apiKey: string, projectId: string): Promise<void>
}
