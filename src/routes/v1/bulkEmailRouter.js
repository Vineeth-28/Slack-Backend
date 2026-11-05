import express from 'express'

import { enqueueBulkEmailController } from '../../controllers/bulkEmailController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import { bulkEmailSchema } from '../../validators/bulkEmailSchema.js'
import { validate } from '../../validators/zodValidator.js'

const router = express.Router()

router.post(
  '/',
  isAuthenticated,
  validate(bulkEmailSchema),
  enqueueBulkEmailController
)

export default router
