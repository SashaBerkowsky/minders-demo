import { Response, NextFunction } from 'express';
import { FeedbackRequest } from '../types'

export const injectProjectId = (req: FeedbackRequest, res: Response, next: NextFunction) => {
    const projectId = req.headers['x-project-id'];

    if (!projectId || typeof projectId !== 'string') {
        return res.status(400).json({
            success: false,
            error: 'Missing or invalid x-project-id header'
        });
    }

    req.projectId = projectId;

    next();
};
