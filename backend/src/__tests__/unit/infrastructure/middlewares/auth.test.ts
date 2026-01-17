import { describe, it, expect, vi, beforeEach } from 'vitest'
import { authMiddleware } from '@infrastructure/http/middlewares/auth'
import type { IProjectRepository } from '@domain'
import type { Request, Response, NextFunction } from 'express'

describe('authMiddleware', () => {
  let mockRepo: IProjectRepository
  let middleware: ReturnType<typeof authMiddleware>

  beforeEach(() => {
    mockRepo = {
      findAll: vi.fn(),
      findById: vi.fn(),
      seed: vi.fn()
    }
    middleware = authMiddleware(mockRepo)
  })

  it('should call next on valid auth', async () => {
    const mockReq = {
      headers: {
        authorization: 'ApiKey minders_secret_key_0',
        'x-project-id': '0'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    vi.mocked(mockRepo.findById).mockResolvedValue({
      id: '0',
      name: 'MELI',
      description: 'MELI sample desc',
      apiKey: 'minders_secret_key_0'
    })

    await middleware(mockReq, mockRes, mockNext)

    expect(mockReq.projectId).toBe('0')
    expect(mockNext).toHaveBeenCalled()
    expect(mockRes.status).not.toHaveBeenCalled()
  })

  it('should return 401 on missing Authorization', async () => {
    const mockReq = {
      headers: {
        'x-project-id': '0'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing or invalid Authorization format. Use "ApiKey <your_key>"'
    })
  })

  it('should return 401 on invalid Authorization format', async () => {
    const mockReq = {
      headers: {
        authorization: 'Bearer token',
        'x-project-id': '0'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing or invalid Authorization format. Use "ApiKey <your_key>"'
    })
  })

  it('should return 401 on missing x-project-id', async () => {
    const mockReq = {
      headers: {
        authorization: 'ApiKey minders_secret_key_0'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(401)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Missing Project ID. Use x-project-id header.'
    })
  })

  it('should return 403 on project not found', async () => {
    const mockReq = {
      headers: {
        authorization: 'ApiKey minders_secret_key_0',
        'x-project-id': '999'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    vi.mocked(mockRepo.findById).mockResolvedValue(undefined)

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized. Invalid credentials'
    })
  })

  it('should return 403 on apiKey mismatch', async () => {
    const mockReq = {
      headers: {
        authorization: 'ApiKey wrong_key',
        'x-project-id': '0'
      }
    } as Request
    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as any
    const mockNext = vi.fn()

    vi.mocked(mockRepo.findById).mockResolvedValue({
      id: '0',
      name: 'MELI',
      description: 'MELI sample desc',
      apiKey: 'minders_secret_key_0'
    })

    await middleware(mockReq, mockRes, mockNext)

    expect(mockNext).not.toHaveBeenCalled()
    expect(mockRes.status).toHaveBeenCalledWith(403)
    expect(mockRes.json).toHaveBeenCalledWith({
      success: false,
      error: 'Unauthorized. Invalid credentials'
    })
  })
})