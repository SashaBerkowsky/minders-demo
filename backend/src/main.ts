import { config } from '@infrastructure/config'
import { authMiddleware } from '@infrastructure/http/middlewares';
import { createServer } from '@infrastructure/http/server';
import { createApiRouter } from '@infrastructure/http/routes';
import { FeedbackController } from '@infrastructure/http/controllers';
import { SubmitFeedbackUC } from '@application';
import { PrismaFeedbackRepository, PrismaProjectRepository } from '@infrastructure/persistence';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const projectRepo = new PrismaProjectRepository(prisma);

const main = async () => {
    await projectRepo.seed();

    const feedbackRepo = new PrismaFeedbackRepository(prisma);
    const submitFeedbackUC = new SubmitFeedbackUC(feedbackRepo);
    const feedbackController = new FeedbackController(submitFeedbackUC);
    const authGuard = authMiddleware(projectRepo);

    const apiRouter = createApiRouter({
        feedbackController,
        authGuard
    });

    const app = createServer(apiRouter);

    app.listen(config.port, () => {
        console.log(`🚀 Server ready at: http://localhost:${config.port}`);
        console.log(`📡 Health check: http://localhost:${config.port}/api/feedback/health`);
    });
}

main()
