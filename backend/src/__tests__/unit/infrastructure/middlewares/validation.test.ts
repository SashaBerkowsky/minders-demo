import { describe, it, expect, vi } from 'vitest'
import { validate } from '@infrastructure/http/middlewares/validation'
import { CreateFeedbackSchema } from '@application/dtos/CreateFeedbackDTO'
import type { Request, Response, NextFunction } from 'express'

describe('validate middleware', () => {
  it('should call next on valid request', async () => {
    const middleware = validate(CreateFeedbackSchema)
    const mockReq = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 4,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      },
      query: {},
      params: {}
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.status).not.toHaveBeenCalled()
  })

  it('should return 400 on invalid request', async () => {
    const middleware = validate(CreateFeedbackSchema)
    const mockReq = {
      body: {
        userId: 'invalid-uuid',
        rating: 4,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      },
      query: {},
      params: {}
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(400)
    expect(mockRes.json).toHaveBeenCalledWith({
      error: 'Validation Failed',
      details: expect.any(Array)
    })
  })
})