import express from 'express'

import { createWorkspaceController} from '../../controllers/workSpaceController.js'
import {isAuthenticated } from '../../middlewares/authMiddleware.js'
import { WorkspaceSchema } from '../../validators/workspace.js'
import {validate} from '../../validators/zodValidator.js'
const router = express.Router()



router.post('/' , isAuthenticated ,validate(WorkspaceSchema) , createWorkspaceController);

export default router
