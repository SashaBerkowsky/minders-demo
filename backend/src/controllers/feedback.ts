import { Request, Response, NextFunction } from 'express'
import { feedbackService } from '../services'
import { FeedbackRequest } from '../types'

export class FeedbackController {
    static async submit(req: FeedbackRequest, res: Response, next: NextFunction) {
        try {
            const result = await feedbackService.createFeedback(req.body, req.projectId)

            return res.status(201).json({
                success: true,
                message: 'Feedback received successfully',
                data: result
            })
        } catch (err) {
            next(err)
        }
    }

    static async getByProject(req: Request, res: Response, next: NextFunction) {
        try {
            const { projectId } = req.params
            if (typeof projectId !== 'string' || !projectId) {
                return res.status(400).json({ error: 'Valid Project ID is required' })
            }

            const results = await feedbackService.getProjectFeedback(projectId)
            return res.status(200).json(results)
        } catch (err) {
            next(err)
        }
    }
}
