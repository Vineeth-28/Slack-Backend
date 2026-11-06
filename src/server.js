import express from 'express'
import { createServer } from 'http'
import { StatusCodes } from 'http-status-codes'
import { Server } from 'socket.io' // 1. Capitalized "Server" here

import connectDB from './config/dbConfig.js'
//import { sendStartupEmail } from './config/nodemailerConfig.js'
import { PORT } from './config/serverConfig.js'
import apiRouter from './routes/apiRoutes.js'

const app = express()
const server = createServer(app)    // 2. "server" variable conflict resolved
const io = new Server(server)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api', apiRouter)

app.get('/health', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  })
})

// 3. Added the missing comma before the (socket) arrow function
io.on('connection', (socket) => {
  // console.log('a user connected', socket.id)
  // //  setTimeout(() => {
  // //   socket.emit('Message', 'Hello from server!')
  // // }, 3000)

  // socket.on('MessagefromClient', (data) => {
  //   console.log('Message from client:', data)
  //   socket.emit('MessagefromServer', data.toUpperCase()) // 4. Corrected the event name to match the emitted event
  // })
  messageSocketController(io, socket);
})

server.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`)

  try {
    await connectDB()
    //const result = await sendStartupEmail()
   // console.log(`Startup test email sent. Message ID: ${result.messageId}`)
    console.log('Startup test email sent.')
  } catch (error) {
    console.error('Server startup task failed:', error)
  }
})
