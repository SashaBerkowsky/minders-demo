import { describe, it, expect, vi, beforeEach } from 'vitest'
import { FeedbackController } from '@infrastructure/http/controllers'
import type { SubmitFeedbackUC } from '@application'
import type { FeedbackRequest } from '@infrastructure/http/types/FeedbackRequest'
import type { Response, NextFunction } from 'express'

describe('FeedbackController', () => {
  let mockUC: SubmitFeedbackUC
  let controller: FeedbackController
  let mockReq: Partial<FeedbackRequest>
  let mockRes: Partial<Response>
  let mockNext: ReturnType<typeof vi.fn<NextFunction>>

  beforeEach(() => {
    mockUC = {
      execute: vi.fn()
    } as any
    controller = new FeedbackController(mockUC)
    mockReq = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 5,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }
    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }
    mockNext = vi.fn()
  })

  it('should submit feedback successfully', async () => {
    const projectId = 'proj-123'
    const feedbackResult = {
      id: 'fb-123',
      projectId,
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 5,
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      },
      createdAt: new Date()
    }
    mockReq.projectId = projectId
    vi.mocked(mockUC.execute).mockResolvedValue(feedbackResult)

    await controller.submit(mockReq as FeedbackRequest, mockRes as Response, mockNext as any)

    expect(mockUC.execute).toHaveBeenCalledWith(mockReq.body, projectId)
    expect(mockRes.status).toHaveBeenCalledWith(201)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: true,
      message: 'Feedback received successfully',
      data: feedbackResult
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should return 400 if projectId is missing', async () => {
    await controller.submit(mockReq as FeedbackRequest, mockRes as Response, mockNext as any)
    mockReq.projectId = undefined

    await controller.submit(mockReq as FeedbackRequest, mockRes as Response, mockNext)

    expect(mockUC.execute).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Project ID is required'
    })
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('should call next with error on UC failure', async () => {
    const projectId = 'proj-123'
    const error = new Error('UC failed')
    mockReq.projectId = projectId
    vi.mocked(mockUC.execute).mockRejectedValue(error)

    await controller.submit(mockReq as FeedbackRequest, mockRes as Response, mockNext as any)

    expect(mockUC.execute).toHaveBeenCalledWith(mockReq.body, projectId)
    expect(mockNext).toHaveBeenCalledWith(error)
    expect(mockRes.status).not.toHaveBeenCalled()
  })
})