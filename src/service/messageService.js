import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import channelRepository from '../repositories/channelRepository.js'
import messageRepository from '../repositories/messageRepository.js'
import clientError from '../utils/errors/clientErrors.js'
import { getWorkspaceService } from './workSpaceService.js'

const validatePagination = (page, limit) => {
  if (!Number.isInteger(page) || page < 1) {
    throw new clientError({
      message: 'Invalid page',
      explanation: 'Page must be a positive integer',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new clientError({
      message: 'Invalid limit',
      explanation: 'Limit must be an integer between 1 and 100',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }
}

export const getMessageService = async (
  workspaceId,
  channelId,
  userId,
  page = 1,
  limit = 20
) => {
  validatePagination(page, limit)

  await getWorkspaceService(workspaceId, userId)

  if (!mongoose.isValidObjectId(channelId)) {
    throw new clientError({
      message: 'Invalid Channel ID',
      explanation: 'A valid channel ID must be provided',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const channel = await channelRepository.getByIdForWorkspace(
    workspaceId,
    channelId
  )
  if (!channel) {
    throw new clientError({
      message: 'Channel not found',
      explanation: 'No channel exists with the provided ID in this workspace',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  return messageRepository.getPaginationMessage(
    { workspace: workspaceId, channelId },
    page,
    limit
  )
}

export const createMessageService = async (message) => {
  const newMessage = await messageRepository.create(message)
  return newMessage
}
