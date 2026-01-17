export interface Feedback {
    id: string
    projectId: string
    userId: string
    rating: number
    comment?: string
    timestamp: string
    createdAt: Date
    deviceInfo: {
        url: string
        userAgent: string
    }
}
