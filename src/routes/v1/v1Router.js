import express from 'express'

import userRouter from './userRouter.js'
import workSpaceRouter from './workSpaceRouter.js'
const router = express.Router()

router.use('/users', userRouter)
router.use('/workspaces', workSpaceRouter)

export default router
