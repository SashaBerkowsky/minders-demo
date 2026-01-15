import { z } from 'zod'

export const createFeedbackSchema = z.object({
    body: z.object({
        userId: z.string().uuid({ message: "User ID must be a valid UUID" }),
        rating: z.number().int().min(1).max(5),
        comment: z.string().max(1000).optional(),
        timestamp: z.string().datetime({ message: "Invalid ISO timestamp" }),
    })
}).strict()
