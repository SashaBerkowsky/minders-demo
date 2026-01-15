import { Request, Response, NextFunction } from 'express'

export const errorHandler = (
    err: any,
    req: Request,
    res: Response,
    _: NextFunction
) => {
    console.error(`[Error] ${req.method} ${req.url}:`, err.message || err)
    const statusCode = err.status || 500

    res.status(statusCode).json({
        success: false,
        error: {
            message: err.message || 'Internal Server Error',
            // Only show stack trace if we are NOT in production
            stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
        }
    });
}
