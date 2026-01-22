import { Request, Response, NextFunction } from 'express'
import { config } from '@infrastructure/config'

export const debugLogger = (req: Request, res: Response, next: NextFunction) => {
  if (config.environment === 'debug') {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.debug(`[DEBUG] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
      console.debug(`[DEBUG] ProjectID: ${req.projectId} - Authorization: ${req.headers.authorization}`);
      console.debug(`[DEBUG] Body:`, JSON.stringify(req.body, null, 2));
    });
  }
  next();
}
