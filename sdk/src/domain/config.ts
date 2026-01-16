import type { Feedback } from './'

export interface SDKConfig {
    projectId: string
    apiKey: string
    apiEndpoint?: string
    theme?: {
        primaryColor?: string
    }
    onSuccess?: (feedback: Feedback) => void
    onError?: (error: Error) => void
    debug?: boolean
}
