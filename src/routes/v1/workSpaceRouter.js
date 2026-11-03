import express from 'express'

import {
  createWorkspaceController,
  deleteWorkspaceController,
  getWorkspaceUserIsMemberController
} from '../../controllers/workSpaceController.js'
import { isAuthenticated } from '../../middlewares/authMiddleware.js'
import { WorkspaceSchema } from '../../validators/workspace.js'
import { validate } from '../../validators/zodValidator.js'
const router = express.Router()

router.post(
  '/',
  isAuthenticated,
  validate(WorkspaceSchema),
  createWorkspaceController
)

router.get('/', isAuthenticated, getWorkspaceUserIsMemberController)
router.delete('/:workspaceId', isAuthenticated, deleteWorkspaceController)

export default router
