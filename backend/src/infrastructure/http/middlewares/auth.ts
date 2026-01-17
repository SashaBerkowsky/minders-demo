import type { RequestHandler, Response, NextFunction } from 'express'
import type { IProjectRepository } from '@domain'
import type { FeedbackRequest } from '../types/FeedbackRequest'

export const authMiddleware = (projectRepository: IProjectRepository): RequestHandler => {
    return async (req: FeedbackRequest, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization
            const projectId = req.headers['x-project-id'] as string

            if (!authHeader || !authHeader.startsWith('ApiKey ')) {
                return res.status(401).json({
                    success: false,
                    error: 'Missing or invalid Authorization format. Use "ApiKey <your_key>"'
                })
            }

            const apiKey = authHeader.split(' ')[1]
            if (!projectId) {
                return res.status(401).json({
                    success: false,
                    error: 'Missing Project ID. Use x-project-id header.'
                })
            }

            const project = await projectRepository.findById(projectId)

            if (!project || project.apiKey !== apiKey) {
                return res.status(403).json({
                    success: false,
                    error: 'Unauthorized. Invalid credentials'
                })
            }

            req.projectId = projectId

            return next()
        } catch (err) {
            return next(err)
        }
    }
}
