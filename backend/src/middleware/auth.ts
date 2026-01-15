import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['minders-api-key']
    const VALID_API_KEY = process.env.API_KEY || 'minders_secret_key'

    if (!apiKey || apiKey !== VALID_API_KEY) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing API Key'
        })
    }

    next();
}
