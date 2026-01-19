export interface AppConfig {
    port: number
    environment: 'development' | 'debug' | 'test' | 'production'
    databaseUrl: string
}

export const config: AppConfig = {
    port: Number(process.env.PORT ?? 3000),
    environment: (process.env.NODE_ENV as AppConfig['environment']) ?? 'development',
    databaseUrl: process.env.DATABASE_URL ?? 'file:./dev.db'
}
