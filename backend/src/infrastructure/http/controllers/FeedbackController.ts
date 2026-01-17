import type { SubmitFeedbackUC } from '@application'
import type { FeedbackRequest } from '../types/FeedbackRequest'
import { Response, NextFunction } from 'express'

export class FeedbackController {
    private submitFeedbackUC: SubmitFeedbackUC

    constructor(submitFeedbackUC: SubmitFeedbackUC) {
        this.submitFeedbackUC = submitFeedbackUC
    }

    submit = async (req: FeedbackRequest, res: Response, next: NextFunction) => {
        try {
            if (!req.projectId) {
                return res.status(400).json({ success: false, error: "Project ID is required" });
            }

            const result = await this.submitFeedbackUC.execute(req.body, req.projectId)

            return res.status(201).json({
                success: true,
                message: 'Feedback received successfully',
                data: result
            })
        } catch (err) {
            next(err)
        }
    }
}
