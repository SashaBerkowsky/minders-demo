import {
  object,
  pipe,
  string,
  minLength,
  optional,
  url,
  boolean,
  function as valFunction,
  number,
  integer,
  minValue,
  maxValue,
  maxLength,
} from 'valibot';
import type { InferOutput } from 'valibot';

export const ConfigSchema = object({
  projectId: pipe(string(), minLength(1, 'Project ID is required.')),
  apiKey: pipe(string(), minLength(1, 'API Key is required.')),
  apiEndpoint: optional(pipe(string(), url('Invalid URL.'))),

  theme: optional(
    object({
      primaryColor: optional(string()),
      backgroundColor: optional(string()),
      textColor: optional(string()),
      borderColor: optional(string()),
      inputBackgroundColor: optional(string()),
      submitColor: optional(string()),
    }),
  ),

  debug: optional(boolean()),
  onSuccess: optional(valFunction()),
  onError: optional(valFunction()),
});

export const FeedbackSchema = object({
  userId: string(),
  rating: pipe(number(), integer(), minValue(1), maxValue(5)),
  comment: optional(
    pipe(string(), maxLength(1000, 'Comment length exceeded.')),
  ),
  deviceInfo: object({
    userAgent: string(),
    url: string(),
  }),
  timestamp: string(),
});

export type SDKConfig = InferOutput<typeof ConfigSchema>;
export type FeedbackPayload = InferOutput<typeof FeedbackSchema>;
