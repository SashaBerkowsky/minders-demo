import type { FeedbackService } from '../services'
import type { FeedbackRequest } from '../types'
import { Request, Response, NextFunction } from 'express'

export class FeedbackController {
    private feedbackService: FeedbackService

    constructor(feedbackService: FeedbackService) {
        this.feedbackService = feedbackService
    }

    submit = async (req: FeedbackRequest, res: Response, next: NextFunction) => {
        try {
            const result = await this.feedbackService.createFeedback(req.body, req.projectId)

            return res.status(201).json({
                success: true,
                message: 'Feedback received successfully',
                data: result
            })
        } catch (err) {
            next(err)
        }
    }

    getByProject = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { projectId } = req.params
            if (typeof projectId !== 'string' || !projectId) {
                return res.status(400).json({ error: 'Valid Project ID is required' })
            }

            const results = await this.feedbackService.getProjectFeedback(projectId)
            return res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
}
