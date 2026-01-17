import type { Project } from '@domain'

export type CreateProjectDTO = Omit<Project, 'id' | 'apiKey'>
