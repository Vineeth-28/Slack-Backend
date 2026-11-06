import express from 'express'

import { getMessage } from '../../controllers/messageController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'

const router = express.Router({ mergeParams: true })

router.get('/', isAuthenticated, getMessage)

export default router
