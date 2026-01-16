import { LocalFeedbackRepository } from './repository'
import { FeedbackService } from './services'
import { FeedbackController } from './controllers'

const feedbackRepository = new LocalFeedbackRepository()
export const feedbackService = new FeedbackService(feedbackRepository)
export const feedbackController = new FeedbackController(feedbackService)
