import { StatusCodes } from 'http-status-codes'

import {
  createChannelService,
  deleteChannelService,
  getChannelById,
  getChannelsService,
  updateChannelService
} from '../service/channelService.js'
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js'

const respondWithError = (res, error) => {
  console.error('Channel controller error:', error)
  if (error.statusCode) {
    return res.status(error.statusCode).json(customErrorResponse(error))
  }
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json(internalErrorResponse(error))
}

export const getChannelsController = async (req, res) => {
  try {
    const channels = await getChannelsService(req.params.workspaceId, req.user)
    return res
      .status(StatusCodes.OK)
      .json(successResponse(channels, 'Channels fetched successfully'))
  } catch (error) {
    return respondWithError(res, error)
  }
}

export const getChannelController = async (req, res) => {
  try {
    const channel = await getChannelById(
      req.params.workspaceId,
      req.params.channelId,
      req.user
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(channel, 'Channel fetched successfully'))
  } catch (error) {
    return respondWithError(res, error)
  }
}

export const createChannelController = async (req, res) => {
  try {
    const channel = await createChannelService(
      req.params.workspaceId,
      req.user,
      req.body.name
    )
    return res
      .status(StatusCodes.CREATED)
      .json(successResponse(channel, 'Channel created successfully'))
  } catch (error) {
    return respondWithError(res, error)
  }
}

export const updateChannelController = async (req, res) => {
  try {
    const channel = await updateChannelService(
      req.params.workspaceId,
      req.params.channelId,
      req.user,
      req.body.name
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(channel, 'Channel updated successfully'))
  } catch (error) {
    return respondWithError(res, error)
  }
}

export const deleteChannelController = async (req, res) => {
  try {
    const channel = await deleteChannelService(
      req.params.workspaceId,
      req.params.channelId,
      req.user
    )
    return res
      .status(StatusCodes.OK)
      .json(successResponse(channel, 'Channel deleted successfully'))
  } catch (error) {
    return respondWithError(res, error)
  }
}
