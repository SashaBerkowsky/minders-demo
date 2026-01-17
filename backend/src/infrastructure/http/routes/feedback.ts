import type { RequestHandler } from 'express'
import type { FeedbackController } from '../controllers'
import { Router } from 'express'
import { validate } from '../middlewares'
import { CreateFeedbackSchema } from '@application'

export const createFeedbackRouter = (controller: FeedbackController, authMiddleware: RequestHandler): Router => {
    const router = Router()

    router.post(
        '/',
        authMiddleware,
        validate(CreateFeedbackSchema),
        controller.submit
    )

    return router
}
