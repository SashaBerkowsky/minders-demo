import { Router } from 'express'
import { FeedbackController } from '../controllers'
import { validate } from '../middleware'
import { createFeedbackSchema } from '../schemas'

const router = Router()

router.post('/', validate(createFeedbackSchema), FeedbackController.submit)
router.get('/project/:projectId', FeedbackController.getByProject)

export default router
