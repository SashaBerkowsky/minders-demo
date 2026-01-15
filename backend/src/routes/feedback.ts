import { Router } from 'express'
import { FeedbackController } from '../controllers'
import { injectProjectId, validate } from '../middleware'
import { createFeedbackSchema } from '../schemas'

const router = Router()

router.post('/', injectProjectId, validate(createFeedbackSchema), FeedbackController.submit)
router.get('/project/:projectId', FeedbackController.getByProject)

export default router
