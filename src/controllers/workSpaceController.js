import { StatusCodes } from 'http-status-codes'

import {
  createWorkspaceService,
  getWorkspaceUserIsMemberofService
} from '../service/workSpaceService.js'
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js'

export const createWorkspaceController = async (req, res) => {
  try {
    const response = await createWorkspaceService({
      ...req.body,
      owner: req.user
    })
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, 'Workspace Created Successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}

export const getWorkspaceUserIsMemberController = async (req, res) => {
  try {
    const response = await getWorkspaceUserIsMemberofService(req.user)
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace fetched Successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
