import * as v from 'valibot';

export const ConfigSchema = v.object({
  projectId: v.pipe(v.string(), v.minLength(1, 'Project ID is required.')),
  apiKey: v.pipe(v.string(), v.minLength(1, 'API Key is required.')),
  apiEndpoint: v.optional(v.pipe(v.string(), v.url('Invalid URL.'))),

  theme: v.optional(
    v.object({
      primaryColor: v.optional(v.string()),
      backgroundColor: v.optional(v.string()),
      textColor: v.optional(v.string()),
      borderColor: v.optional(v.string()),
      inputBackgroundColor: v.optional(v.string()),
    }),
  ),

  debug: v.optional(v.boolean()),
  onSuccess: v.optional(v.function()),
  onError: v.optional(v.function()),
});

export const FeedbackSchema = v.object({
  userId: v.string(),
  rating: v.pipe(v.number(), v.integer(), v.minValue(1), v.maxValue(5)),
  comment: v.optional(
    v.pipe(v.string(), v.maxLength(1000, 'Comment length exceeded.')),
  ),
  deviceInfo: v.object({
    userAgent: v.string(),
    url: v.string(),
  }),
  timestamp: v.string(),
});

export type SDKConfig = v.InferOutput<typeof ConfigSchema>;
export type FeedbackPayload = v.InferOutput<typeof FeedbackSchema>;
