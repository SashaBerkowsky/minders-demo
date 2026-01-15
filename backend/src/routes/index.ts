import { Router } from 'express'
import feedbackRoutes from './feedback'
import { authMiddleware } from '../middleware'

const router = Router()

router.get('/health', (_, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    })
})

// add middlewares after /health
router.use(authMiddleware)

router.use('/feedback', feedbackRoutes)

export default router
