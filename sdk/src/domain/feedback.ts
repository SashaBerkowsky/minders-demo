export interface Feedback {
  userId: string;
  rating: number;
  comment?: string;
  deviceInfo: {
    userAgent: string;
    url: string;
  };
  timestamp: string;
}
