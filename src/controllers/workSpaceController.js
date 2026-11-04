import { StatusCodes } from 'http-status-codes'

import {
  addMembertoWorkspaceService,
  createWorkspaceService,
  deleteWorkspaceService,
  getWorkspaceByJoinCodeService,
  getWorkspaceService,
  getWorkspaceUserIsMemberofService,
  updateWorkspaceService
} from '../service/workSpaceService.js'
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js'
import clientError from '../utils/errors/clientErrors.js'

const isWorkspaceAdmin = async (workspaceId, userId) => {
  const workspace = await getWorkspaceService(workspaceId, userId)
  return workspace.members.some(
    (member) =>
      String(member.memberId?._id ?? member.memberId) === String(userId) &&
      member.role === 'admin'
  )
}

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

export const getWorkspaceController = async (req, res) => {
  try {
    const response = await getWorkspaceService(req.params.workspaceId, req.user)
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

export const getWorkspaceByJoinCodeController = async (req, res) => {
  try {
    const response = await getWorkspaceByJoinCodeService(
      req.body.joinCode,
      req.user
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Joined workspace successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}

export const updateWorkspaceController = async (req, res) => {
  try {
    const isAdmin = await isWorkspaceAdmin(req.params.workspaceId, req.user)
    if (!isAdmin) {
      throw new clientError({
        message: 'Only workspace admins can update member roles',
        explanation: 'The current user is not an admin of this workspace',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    const response = await updateWorkspaceService(
      req.params.workspaceId,
      req.params.memberId,
      req.body.role
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace member updated successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}

export const addMembertoWorkspaceController = async (req, res) => {
  try {
    const isAdmin = await isWorkspaceAdmin(req.params.workspaceId, req.user)
    if (!isAdmin) {
      throw new clientError({
        message: 'Only workspace admins can add members',
        explanation: 'The current user is not an admin of this workspace',
        statusCode: StatusCodes.FORBIDDEN
      })
    }

    const response = await addMembertoWorkspaceService(
      req.params.workspaceId,
      req.body.memberId,
      req.body.role
    )
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(response, 'Workspace member added successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}

export const deleteWorkspaceController = async (req, res) => {
  try {
    const response = await deleteWorkspaceService(
      req.params.workspaceId,
      req.user
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(response, 'Workspace deleted successfully'))
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
