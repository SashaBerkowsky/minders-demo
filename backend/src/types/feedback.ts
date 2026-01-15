import { Request } from 'express'

export interface Feedback {
    id: string
    projectId: string
    userId: string
    rating: number
    comment?: string
    timestamp: string
    createdAt: Date
}

export type CreateFeedbackDTO = Omit<Feedback, 'id' | 'createdAt' | 'projectId'>

export interface FeedbackRequest extends Request {
    body: CreateFeedbackDTO
    projectId: string
}
