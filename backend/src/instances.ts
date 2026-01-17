import { LocalFeedbackRepository, LocalProjectRepository } from './repository'
import { FeedbackController } from './controllers'
import { authMiddleware } from './middleware'
import { FeedbackService } from './services'

const feedbackRepository = new LocalFeedbackRepository()
const projectRepository = new LocalProjectRepository()
projectRepository.seed()

export const feedbackService = new FeedbackService(feedbackRepository)
export const feedbackController = new FeedbackController(feedbackService)
export const authGuard = authMiddleware(projectRepository)
