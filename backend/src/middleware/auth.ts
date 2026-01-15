import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('ApiKey ')) {
        return res.status(401).json({
            success: false,
            error: 'Missing or invalid Authorization format. Use "ApiKey <your_key>"'
        })
    }

    const apiKey = authHeader.split(' ')[1]
    const VALID_API_KEY = process.env.API_KEY || 'minders_secret_key'

    if (apiKey !== VALID_API_KEY) {
        return res.status(403).json({
            success: false,
            error: 'Invalid API Key'
        })
    }

    next()
}
