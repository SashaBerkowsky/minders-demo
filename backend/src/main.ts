import { createServer } from '@infrastructure/http/server';
import { createApiRouter } from '@infrastructure/http/routes';
import { FeedbackController } from '@infrastructure/http/controllers';
import { SubmitFeedbackUC } from '@application';
import { LocalFeedbackRepository, LocalProjectRepository } from '@infrastructure/persistence';
import { authMiddleware } from '@infrastructure/http/middlewares';

const feedbackRepo = new LocalFeedbackRepository();
const projectRepo = new LocalProjectRepository();
const submitFeedbackUC = new SubmitFeedbackUC(feedbackRepo);
const feedbackController = new FeedbackController(submitFeedbackUC);
const authGuard = authMiddleware(projectRepo);

projectRepo.seed()

const apiRouter = createApiRouter({
    feedbackController,
    authGuard
});

const app = createServer(apiRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/feedback/health`);
})
