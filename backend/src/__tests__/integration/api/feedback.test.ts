import { describe, it, expect, beforeEach } from 'vitest'
import request from 'supertest'
import { createServer } from '@infrastructure/http/server'
import { createApiRouter } from '@infrastructure/http/routes'
import { FeedbackController } from '@infrastructure/http/controllers'
import { SubmitFeedbackUC } from '@application'
import { LocalFeedbackRepository, LocalProjectRepository } from '@infrastructure/persistence'
import { authMiddleware } from '@infrastructure/http/middlewares'

describe('Feedback API Integration', () => {
  let app: ReturnType<typeof createServer>
  let projectRepo: LocalProjectRepository

  beforeEach(() => {
    projectRepo = new LocalProjectRepository()
    projectRepo.seed()

    const feedbackRepo = new LocalFeedbackRepository()
    const submitFeedbackUC = new SubmitFeedbackUC(feedbackRepo)
    const feedbackController = new FeedbackController(submitFeedbackUC)
    const authGuard = authMiddleware(projectRepo)

    const apiRouter = createApiRouter({
      feedbackController,
      authGuard
    })

    app = createServer(apiRouter)
  })

  it('should return 200 for health check', async () => {
    const response = await request(app).get('/api/health')
    expect(response.status).toBe(200)
    expect(response.body).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String)
    })
  })

  it('should submit feedback successfully', async () => {
    const feedbackData = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      comment: 'Good service',
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', 'ApiKey minders_secret_key_0')
      .set('x-project-id', '0')
      .send(feedbackData)

    expect(response.status).toBe(201)
    expect(response.body).toMatchObject({
      success: true,
      message: 'Feedback received successfully',
      data: {
        ...feedbackData,
        id: expect.any(String),
        projectId: '0',
        createdAt: expect.any(String)
      }
    })
  })

  it('should return 401 for invalid auth', async () => {
    const feedbackData = {
      userId: '550e8400-e29b-41d4-a716-446655440000',
      rating: 4,
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', 'ApiKey wrong_key')
      .set('x-project-id', '0')
      .send(feedbackData)

    expect(response.status).toBe(403)
    expect(response.body).toMatchObject({
      success: false,
      error: 'Unauthorized. Invalid credentials'
    })
  })

  it('should return 400 for invalid data', async () => {
    const invalidData = {
      userId: 'invalid-uuid',
      rating: 4,
      timestamp: '2023-10-01T12:00:00.000Z',
      deviceInfo: {
        url: 'https://example.com',
        userAgent: 'Mozilla/5.0'
      }
    }

    const response = await request(app)
      .post('/api/feedback')
      .set('Authorization', 'ApiKey minders_secret_key_0')
      .set('x-project-id', '0')
      .send(invalidData)

    expect(response.status).toBe(400)
    expect(response.body).toHaveProperty('error', 'Validation Failed')
    expect(response.body.details).toBeDefined()
  })
})