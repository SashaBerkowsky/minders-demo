import { Router } from 'express'
import { feedbackController } from '../instances'
import { validate } from '../middleware'
import { createFeedbackSchema } from '../schemas'
import { authGuard } from '../instances'

const router = Router()

router.post('/', authGuard, validate(createFeedbackSchema), feedbackController.submit)

export default router
