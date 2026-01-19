import type { Feedback } from './';

export interface SDKConfig {
  projectId: string;
  apiKey: string;
  apiEndpoint?: string;
  theme?: {
    primaryColor?: string;
  };

  onSuccess?: (_feedback: Feedback) => void;
  onError?: (_error: Error) => void;
  debug?: boolean;
}
