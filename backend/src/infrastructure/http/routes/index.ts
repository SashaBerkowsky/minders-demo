import type { FeedbackController } from '../controllers'
import type { RequestHandler } from 'express'
import { Router } from 'express'
import { createFeedbackRouter } from './feedback'

interface RouterDependencies {
    feedbackController: FeedbackController
    authGuard: RequestHandler
}

export const createApiRouter = ({ feedbackController, authGuard }: RouterDependencies): Router => {
    const router = Router()

    router.get('/health', (_, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString()
        });
    });

    router.use('/feedback', createFeedbackRouter(feedbackController, authGuard))

    return router
}
