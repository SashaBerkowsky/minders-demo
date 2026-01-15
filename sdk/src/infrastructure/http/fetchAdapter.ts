import type { FeedbackRepository } from '../../application/ports'
import type { Feedback } from '../../domain'

export class FetchFeedbackRepository implements FeedbackRepository {
    async send(
        feedback: Feedback,
        endpoint: string,
        apiKey: string,
        projectId: string
    ): Promise<void> {
        const maxRetries = 3;
        let attempt = 0;

        while (attempt < maxRetries) {
            try {
                const response = await fetch(endpoint, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `ApiKey ${apiKey}`,
                        "x-project-id": projectId,
                    },
                    body: JSON.stringify(feedback),
                })

                if (response.ok) return
                console.log(response)
                if (response.status < 500)
                    throw new Error(`CLIENT_ERROR:${response.status}`)

                throw new Error(`SERVER_ERROR:${response.status}`)
            } catch (error: any) {
                attempt++;
                if (error.message.includes("CLIENT_ERROR") || attempt >= maxRetries) {
                    throw error;
                }
                // Exponential Backoff: 1s, 2s, 4s
                await new Promise((r) =>
                    setTimeout(r, 1000 * Math.pow(2, attempt - 1)),
                )
            }
        }
    }
}
