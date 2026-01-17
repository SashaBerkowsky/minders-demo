import { Request, Response, NextFunction } from 'express'

export const debugLogger = (req: Request, res: Response, next: NextFunction) => {
    if (process.env.NODE_ENV === 'debug') {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.debug(`[DEBUG] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
            console.debug(`[DEBUG] Body:`, JSON.stringify(req.body, null, 2));
        });
    }
    next();
}
