import express from 'express'
import cors from 'cors'
import routes from './routes'
import { errorHandler } from './middleware'

const PORT = process.env.PORT || 3000
const app = express()

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-project-id']
}));

app.use(express.json())

app.use('/api', routes)

app.use((_, res) => {
    res.status(404).json({ error: 'Route not found.' })
})

app.use(errorHandler)

console.log('DEBUG: Raw Process Port:', process.env.PORT);
app.listen(PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/feedback/health`);
});
