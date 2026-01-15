import express from 'express'
import routes from './routes'
import { errorHandler } from './middleware'

const PORT = process.env.PORT || 3000
const app = express()

app.use(express.json())

app.use('/api/feedback', routes)

app.use((_, res) => {
    res.status(404).json({ error: 'Route not found.' })
})

app.use(errorHandler)

console.log('DEBUG: Raw Process Port:', process.env.PORT);
app.listen(PORT, () => {
    console.log(`🚀 Server ready at: http://localhost:${PORT}`);
    console.log(`📡 Health check: http://localhost:${PORT}/api/feedback/health`);
});
