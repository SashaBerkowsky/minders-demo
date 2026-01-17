import { describe, it, expect, vi, beforeEach } from 'vitest'
import { PrismaFeedbackRepository } from '@infrastructure/persistence/prisma/PrismaFeedbackRepository'
import type { CreateFeedbackDTO } from '@application'

describe('PrismaFeedbackRepository', () => {
  let mockPrisma: any
  let repo: PrismaFeedbackRepository

  beforeEach(() => {
    mockPrisma = {
      feedback: {
        create: vi.fn(),
        findMany: vi.fn()
      }
    }
    repo = new PrismaFeedbackRepository(mockPrisma)
  })

  it('should save feedback and return it', async () => {
    const feedbackData: CreateFeedbackDTO = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      comment: 'Good!',
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }
    const projectId = 'proj-123'
    const createdFeedback = {
      id: 'fb-123',
      ...feedbackData,
      projectId,
      createdAt: new Date(),
      deviceInfo: JSON.stringify(feedbackData.deviceInfo)
    }

    vi.mocked(mockPrisma.feedback.create).mockResolvedValue(createdFeedback)

    const result = await repo.save(feedbackData, projectId)

    expect(mockPrisma.feedback.create).toHaveBeenCalledWith({
      data: {
        ...feedbackData,
        projectId,
        deviceInfo: JSON.stringify(feedbackData.deviceInfo)
      }
    })
    expect(result).toEqual({
      ...createdFeedback,
      deviceInfo: feedbackData.deviceInfo
    })
  })

  it('should find all feedbacks', async () => {
    const feedbacksFromDb = [
      {
        id: 'fb-1',
        userId: 'user-1',
        rating: 5,
        comment: 'Great!',
        timestamp: '2023-10-01T12:00:00.000Z',
        createdAt: new Date(),
        projectId: 'proj-1',
        deviceInfo: JSON.stringify({ url: 'https://example.com', userAgent: 'Mozilla' })
      },
      {
        id: 'fb-2',
        userId: 'user-2',
        rating: 3,
        comment: null,
        timestamp: '2023-10-01T13:00:00.000Z',
        createdAt: new Date(),
        projectId: 'proj-2',
        deviceInfo: JSON.stringify({ url: 'https://example2.com', userAgent: 'Chrome' })
      }
    ]

    vi.mocked(mockPrisma.feedback.findMany).mockResolvedValue(feedbacksFromDb)

    const result = await repo.findAll()

    expect(mockPrisma.feedback.findMany).toHaveBeenCalled()
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({
      ...feedbacksFromDb[0],
      comment: 'Great!',
      deviceInfo: { url: 'https://example.com', userAgent: 'Mozilla' }
    })
    expect(result[1]).toEqual({
      ...feedbacksFromDb[1],
      comment: undefined, // null mapped
      deviceInfo: { url: 'https://example2.com', userAgent: 'Chrome' }
    })
  })
})