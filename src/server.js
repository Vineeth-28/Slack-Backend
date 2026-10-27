import express from 'express'
import { PORT } from './config/serverConfig.js'
import { StatusCodes } from 'http-status-codes'

const app = express()

app.get('/health', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: 'pong'
  })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
