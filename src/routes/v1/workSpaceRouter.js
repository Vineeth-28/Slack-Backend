import express from 'express'

import {
  addChannelToWorkspaceController,
  addMembertoWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspaceUserIsMemberController,
  updateWorkspaceController
} from '../../controllers/workSpaceController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import {
  addWorkspaceChannelSchema,
  addWorkspaceMemberSchema,
  joinWorkspaceSchema,
  updateWorkspaceMemberSchema,
  WorkspaceSchema
} from '../../validators/workspace.js'
import { validate } from '../../validators/zodValidator.js'

const router = express.Router()

router.post(
  '/',
  isAuthenticated,
  validate(WorkspaceSchema),
  createWorkspaceController
)

router.get('/', isAuthenticated, getWorkspaceUserIsMemberController)
router.get('/:workspaceId', isAuthenticated, getWorkspaceController)
router.post(
  '/join',
  isAuthenticated,
  validate(joinWorkspaceSchema),
  getWorkspaceByJoinCodeController
)
router.post(
  '/:workspaceId/members',
  isAuthenticated,
  validate(addWorkspaceMemberSchema),
  addMembertoWorkspaceController
)
router.patch(
  '/:workspaceId/members/:memberId',
  isAuthenticated,
  validate(updateWorkspaceMemberSchema),
  updateWorkspaceController
)
router.post(
  '/:workspaceId/channels',
  isAuthenticated,
  validate(addWorkspaceChannelSchema),
  addChannelToWorkspaceController
)
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController)

export default router
