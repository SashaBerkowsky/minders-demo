import type { IFeedbackRepository, Feedback } from '@domain'
import type { CreateFeedbackDTO } from '@application'
import { PrismaClient } from '@prisma/client'

export class PrismaFeedbackRepository implements IFeedbackRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async save(feedbackData: CreateFeedbackDTO, projectId: string): Promise<Feedback> {
    const feedback = await this.prisma.feedback.create({
      data: {
        ...feedbackData,
        projectId,
        deviceInfo: JSON.stringify(feedbackData.deviceInfo), // Serialize to string
      },
    })

    return {
      ...feedback,
      comment: feedback.comment || undefined,
      deviceInfo: JSON.parse(feedback.deviceInfo as string), // Deserialize to object
    }
  }

  async findAll(): Promise<Feedback[]> {
    const feedbacks = await this.prisma.feedback.findMany()
    return feedbacks.map(f => ({
      ...f,
      comment: f.comment || undefined,
      deviceInfo: JSON.parse(f.deviceInfo as string), // Deserialize
    }))
  }
}