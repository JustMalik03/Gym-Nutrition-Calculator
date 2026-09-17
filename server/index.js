import express from 'express'

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' })
})

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`)
})