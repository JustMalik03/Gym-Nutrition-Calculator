import express from 'express'
import 'dotenv/config.js'
import {MongoClient} from 'mongodb'

const app = express()
const port = process.env.PORT || 3000
const client = new MongoClient(process.env.MONGODB_URI)

app.use(express.json())

//Applying Middleware to allow frontend to communicate with server for local testing
//Will have to change later
app.use((request, response, next) => {
  response.header('Access-Control-Allow-Origin', 'http://localhost:5173')
  response.header('Access-Control-Allow-Headers', 'Content-Type')
  next()
})

//Test for server status at this url
//The initial await client..... to the response status is AI generated code
app.get('/api/health', async (request, response) => {
  try {
    await client.db(process.env.MONGODB_DB).command({ ping: 1 })
    response.status(200).json({ status: 'ok' })
  } catch (error) {
    console.error('Error occurred while checking server status:', error)
    response.status(500).json({ status: 'error' })
  }
})

//Will attempt to start the DB cannot run server if DB is not connected
async function startServer() {
  await client.connect()
  console.log('Connected to MongoDB')

  app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`)
  })
}

startServer().catch((error) => {
  console.error('Could not start server:', error)
  process.exit(1)
})