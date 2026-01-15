import * as v from "valibot";

export const ConfigSchema = v.object({
    projectId: v.pipe(v.string(), v.minLength(1, "Project ID es requerido")),
    apiKey: v.pipe(v.string(), v.minLength(1, "API Key es requerida")),
    apiEndpoint: v.optional(v.pipe(v.string(), v.url("Debe ser una URL válida"))),

    theme: v.optional(
        v.object({
            primaryColor: v.optional(v.string()),
            backgroundColor: v.optional(v.string()),
            textColor: v.optional(v.string()),
            borderColor: v.optional(v.string()),
            inputBackgroundColor: v.optional(v.string()),
        }),
    ),
});

export const FeedbackSchema = v.object({
    userId: v.string(),
    rating: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5)),
    comment: v.optional(
        v.pipe(v.string(), v.maxLength(1000, "El comentario es muy largo")),
    ),
    deviceInfo: v.object({
        userAgent: v.string(),
        url: v.string(),
    }),
    timestamp: v.string(),
});

export type SDKConfig = v.InferOutput<typeof ConfigSchema>;
export type FeedbackPayload = v.InferOutput<typeof FeedbackSchema>;
