import { Router } from 'express'
import { feedbackController } from '../instances'
import { injectProjectId, validate } from '../middleware'
import { createFeedbackSchema } from '../schemas'

const router = Router()

router.post('/', injectProjectId, validate(createFeedbackSchema), feedbackController.submit)
router.get('/project/:projectId', feedbackController.getByProject)

export default router
