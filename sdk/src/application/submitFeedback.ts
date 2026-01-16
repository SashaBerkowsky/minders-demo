import type { Feedback, SDKConfig } from "../domain";
import type { FeedbackRepository, UserStorage } from "./ports";
import { FeedbackSchema } from "../domain/validation";
import * as v from "valibot";

export class SubmitFeedbackUseCase {
    private readonly repository: FeedbackRepository
    private readonly storage: UserStorage
    private readonly config: SDKConfig
    constructor(
        repository: FeedbackRepository,
        storage: UserStorage,
        config: SDKConfig,
    ) {
        this.repository = repository
        this.storage = storage
        this.config = config
    }

    async execute(rating: number, comment: string): Promise<Feedback> {
        const rawFeedback = {
            userId: this.storage.getUserId(),
            rating,
            comment,
            deviceInfo: {
                userAgent: navigator.userAgent,
                url: window.location.href,
            },
            timestamp: new Date().toISOString(),
        }

        const result = v.safeParse(FeedbackSchema, rawFeedback)
        if (!result.success) {
            console.error(result.issues)
            throw new Error("VALIDATION_ERROR")
        }

        const endpoint =
            this.config.apiEndpoint || "https://api.default.com/feedback"
        await this.repository.send(
            result.output as Feedback,
            endpoint,
            this.config.apiKey,
            this.config.projectId
        )

        this.storage.recordSubmission()

        return result.output
    }
}
