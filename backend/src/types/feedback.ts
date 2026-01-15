import { Request } from 'express'

export interface Feedback {
    id: string
    projectId: string
    userId: string
    rating: number
    comment?: string
    timestamp: string
    createdAt: Date
    deviceInfo: {
        url: string
        userAgent: string
    }
}

export type CreateFeedbackDTO = Omit<Feedback, 'id' | 'createdAt' | 'projectId'>

export interface FeedbackRequest extends Request {
    body: CreateFeedbackDTO
    projectId: string
}
