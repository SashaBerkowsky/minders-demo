import { describe, it, expect, vi, beforeEach } from 'vitest'
import { SubmitFeedbackUC } from '@application/SubmitFeedbackUC'
import type { IFeedbackRepository } from '@domain'
import type { CreateFeedbackDTO } from '@application'

describe('SubmitFeedbackUC', () => {
  let mockRepo: IFeedbackRepository
  let uc: SubmitFeedbackUC

  beforeEach(() => {
    mockRepo = {
      save: vi.fn(),
      findAll: vi.fn()
    }
    uc = new SubmitFeedbackUC(mockRepo)
  })

  it('should execute successfully and return feedback', async () => {
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
    const expectedFeedback = {
      ...feedbackData,
      id: 'fb-123',
      projectId,
      createdAt: new Date()
    }

    vi.mocked(mockRepo.save).mockResolvedValue(expectedFeedback)

    const result = await uc.execute(feedbackData, projectId)

    expect(mockRepo.save).toHaveBeenCalledWith(feedbackData, projectId)
    expect(result).toEqual(expectedFeedback)
  })

  it('should propagate repository errors', async () => {
    const feedbackData: CreateFeedbackDTO = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 3,
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }
    const projectId = 'proj-123'
    const error = new Error('Repo failed')

    vi.mocked(mockRepo.save).mockRejectedValue(error)

    await expect(uc.execute(feedbackData, projectId)).rejects.toThrow('Repo failed')
    expect(mockRepo.save).toHaveBeenCalledWith(feedbackData, projectId)
  })
})