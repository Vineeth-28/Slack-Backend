import express from 'express'

import {
  createChannelController,
  deleteChannelController,
  getChannelController,
  getChannelsController,
  updateChannelController
} from '../../controllers/channelController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import {
  addWorkspaceChannelSchema,
  updateWorkspaceChannelSchema
} from '../../validators/workspace.js'
import { validate } from '../../validators/zodValidator.js'

const router = express.Router({ mergeParams: true })

router.post(
  '/',
  isAuthenticated,
  validate(addWorkspaceChannelSchema),
  createChannelController
)
router.get('/', isAuthenticated, getChannelsController)
router.get('/:channelId', isAuthenticated, getChannelController)
router.patch(
  '/:channelId',
  isAuthenticated,
  validate(updateWorkspaceChannelSchema),
  updateChannelController
)
router.delete('/:channelId', isAuthenticated, deleteChannelController)

export default router
