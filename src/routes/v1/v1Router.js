import express from 'express'

import channelRouter from './channelRouter.js'
import userRouter from './userRouter.js'
import workSpaceRouter from './workSpaceRouter.js'

const router = express.Router()

router.use('/users', userRouter)
router.use('/workspaces/:workspaceId/channels', channelRouter)
router.use('/workspaces', workSpaceRouter)

export default router
