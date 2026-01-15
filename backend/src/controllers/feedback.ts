import { Request, Response, NextFunction } from 'express'
import { feedbackService } from '../services'
import { CreateFeedbackDTO } from '../types'

export class FeedbackController {
    static async submit(req: Request, res: Response, next: NextFunction) {
        try {
            const feedbackData: CreateFeedbackDTO = req.body
            const result = await feedbackService.createFeedback(feedbackData)

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
