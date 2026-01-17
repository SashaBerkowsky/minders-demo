import { describe, it, expect, beforeEach } from 'vitest'
import { LocalFeedbackRepository } from '@infrastructure/persistence/local/LocalFeedbackRepository'
import type { CreateFeedbackDTO } from '@application'

describe('LocalFeedbackRepository', () => {
  let repo: LocalFeedbackRepository

  beforeEach(() => {
    repo = new LocalFeedbackRepository()
  })

  it('should save feedback and return it', async () => {
    const feedbackData: CreateFeedbackDTO = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 5,
      comment: 'Excellent!',
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }
    const projectId = 'proj-123'

    const result = await repo.save(feedbackData, projectId)

    expect(result).toMatchObject({
      ...feedbackData,
      id: expect.any(String),
      projectId,
      createdAt: expect.any(Date)
    })
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
  })

  it('should find all feedbacks', async () => {
    const feedbackData1: CreateFeedbackDTO = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }
    const feedbackData2: CreateFeedbackDTO = {
      userId: '550e8400-e29b-41d4-a716-446655440001',
      rating: 3,
      timestamp: '2023-10-01T13:00:00.000Z',
      deviceInfo: {
        url: 'https://example2.com',
        userAgent: 'Chrome'
      }
    }

    await repo.save(feedbackData1, 'proj-1')
    await repo.save(feedbackData2, 'proj-2')

    const results = await repo.findAll()

    expect(results).toHaveLength(2)
    expect(results[0]).toMatchObject({
      ...feedbackData1,
      projectId: 'proj-1',
      id: expect.any(String),
      createdAt: expect.any(Date)
    })
    expect(results[1]).toMatchObject({
      ...feedbackData2,
      projectId: 'proj-2',
      id: expect.any(String),
      createdAt: expect.any(Date)
    })
  })

  it('should return empty array when no feedbacks', async () => {
    const results = await repo.findAll()
    expect(results).toEqual([])
  })
})