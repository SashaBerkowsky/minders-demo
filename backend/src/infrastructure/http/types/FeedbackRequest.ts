import type { CreateFeedbackDTO } from '@application'
import { Request } from 'express'

export interface FeedbackRequest extends Request {
    body: CreateFeedbackDTO
    projectId?: string
}
