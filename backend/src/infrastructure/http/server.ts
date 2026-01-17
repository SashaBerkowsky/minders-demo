import express, { Application, Router } from 'express';
import cors from 'cors';
import { debugLogger } from './middlewares'

export const createServer = (apiRouter: Router): Application => {
    const app = express();

    app.use(cors({
        origin: '*',
        methods: ['GET', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'x-project-id']
    }));

    app.use(express.json());

    app.use(debugLogger);

    app.use('/api', apiRouter);

    app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
        console.error(err.stack);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    });

    return app;
};
