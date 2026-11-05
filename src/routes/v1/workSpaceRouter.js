import express from 'express'

import {
  addMembertoWorkspaceController,
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceByJoinCodeController,
  getWorkspaceController,
  getWorkspaceMemberController,
  getWorkspaceUserIsMemberController,
  updateWorkspaceController
} from '../../controllers/workSpaceController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import {
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
router.get(
  '/:workspaceId/members/:memberId',
  isAuthenticated,
  getWorkspaceMemberController
)
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
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController)

export default router
