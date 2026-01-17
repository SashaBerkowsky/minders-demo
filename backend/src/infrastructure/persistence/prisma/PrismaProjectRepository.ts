import type { IProjectRepository, Project } from '@domain'
import type { CreateProjectDTO } from '@application'
import { PrismaClient } from '@prisma/client'

export class PrismaProjectRepository implements IProjectRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  async findAll(): Promise<Project[]> {
    return this.prisma.project.findMany()
  }

  async findById(id: string): Promise<Project | undefined> {
    const project = await this.prisma.project.findUnique({ where: { id } })
    return project || undefined
  }

  async seed(): Promise<void> {
    const seedData: CreateProjectDTO[] = [
      { name: "MELI", description: "MELI sample desc" },
      { name: "Uala", description: "Uala sample desc" },
      { name: "Cocos", description: "Cocos sample desc" },
    ]

    for (let i = 0; i < seedData.length; i++) {
      await this.prisma.project.upsert({
        where: { id: String(i) },
        update: {},
        create: {
          id: String(i),
          ...seedData[i],
          apiKey: `minders_secret_key_${i}`
        },
      })
    }
  }
}