import { z } from 'zod'

export const CreateFeedbackSchema = z.object({
    body: z.object({
        userId: z.string().uuid({ message: "User ID must be a valid UUID" }),
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(1000).optional(),
        timestamp: z.string().datetime({ message: "Invalid ISO timestamp" }),
        deviceInfo: z.object({
            url: z.string().url({ message: "Invalid source URL" }),
            userAgent: z.string()
                .min(1, "User agent is required")
                .max(500, "User agent is too long"),
        })
    }).strict(),
    query: z.object({}).optional(),
    params: z.object({}).optional()
})

export type CreateFeedbackDTO = z.infer<typeof CreateFeedbackSchema>['body']
