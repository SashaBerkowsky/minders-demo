import { Router } from 'express'
import feedbackRoutes from './feedback'

const router = Router()

router.get('/health', (_, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString()
    })
})

router.use('/feedback', feedbackRoutes)

export default router
