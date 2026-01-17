import "dotenv/config";
import { createServer } from '@infrastructure/http/server';
import { createApiRouter } from '@infrastructure/http/routes';
import { FeedbackController } from '@infrastructure/http/controllers';
import { SubmitFeedbackUC } from '@application';
import { LocalFeedbackRepository, PrismaProjectRepository } from '@infrastructure/persistence';
import { authMiddleware } from '@infrastructure/http/middlewares';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const projectRepo = new PrismaProjectRepository(prisma);

const main = async () => {
    await projectRepo.seed();

    const feedbackRepo = new LocalFeedbackRepository();
    const submitFeedbackUC = new SubmitFeedbackUC(feedbackRepo);
    const feedbackController = new FeedbackController(submitFeedbackUC);
    const authGuard = authMiddleware(projectRepo);

    const apiRouter = createApiRouter({
        feedbackController,
        authGuard
    });

    const app = createServer(apiRouter);

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server ready at: http://localhost:${PORT}`);
        console.log(`📡 Health check: http://localhost:${PORT}/api/feedback/health`);
        console.log('📊 Using Prisma for project storage');
    });
}

main()
