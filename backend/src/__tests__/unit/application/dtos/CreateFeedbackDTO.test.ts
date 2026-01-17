import { describe, it, expect } from 'vitest'
import { CreateFeedbackSchema } from '@application/dtos/CreateFeedbackDTO'

describe('CreateFeedbackSchema', () => {
  it('should validate valid feedback data', () => {
    const validData = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 4,
        comment: 'Great service!',
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('should reject invalid rating', () => {
    const invalidData = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 6, // Invalid: >5
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.message.includes('5'))).toBe(true)
  })

  it('should reject invalid UUID', () => {
    const invalidData = {
      body: {
        userId: 'invalid-uuid',
        rating: 3,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.message.includes('UUID'))).toBe(true)
  })

  it('should reject invalid timestamp', () => {
    const invalidData = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 3,
        timestamp: 'invalid-date',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.message.includes('timestamp'))).toBe(true)
  })

  it('should reject invalid URL', () => {
    const invalidData = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 3,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'invalid-url',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.message.includes('Invalid source URL'))).toBe(true)
  })

  it('should accept optional comment', () => {
    const dataWithoutComment = {
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

    const result = CreateFeedbackSchema.safeParse(dataWithoutComment)
    expect(result.success).toBe(true)
  })

  it('should reject comment too long', () => {
    const longComment = 'a'.repeat(1001)
    const invalidData = {
      body: {
        userId: '550e8400-e29b-41d4-a716-446655440000',
        rating: 4,
        comment: longComment,
        timestamp: '2023-10-01T12:00:00.000Z',
        deviceInfo: {
          url: 'https://example.com',
          userAgent: 'Mozilla/5.0'
        }
      }
    }

    const result = CreateFeedbackSchema.safeParse(invalidData)
    expect(result.success).toBe(false)
    expect(result.error?.issues.some(issue => issue.message.includes('Too big'))).toBe(true)
  })
})