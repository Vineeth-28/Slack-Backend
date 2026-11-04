import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import channelRepository from '../repositories/channelRepository.js'
import WorkspaceRepository from '../repositories/workspaceRepository.js'
import clientError from '../utils/errors/clientErrors.js'

const ensureValidObjectId = (value, label) => {
  if (!value || !mongoose.isValidObjectId(value)) {
    throw new clientError({
      message: `Invalid ${label} ID`,
      explanation: `A valid ${label.toLowerCase()} ID must be provided`,
      statusCode: StatusCodes.BAD_REQUEST
    })
  }
}

const getWorkspaceForMember = async (workspaceId, userId) => {
  ensureValidObjectId(workspaceId, 'Workspace')
  ensureValidObjectId(userId, 'User')

  const workspace = await WorkspaceRepository.getById(workspaceId)
  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const membership = workspace.members.find(
    (member) => member.memberId?.toString() === userId.toString()
  )
  if (!membership) {
    throw new clientError({
      message: 'Access denied',
      explanation: 'The current user is not a member of this workspace',
      statusCode: StatusCodes.FORBIDDEN
    })
  }

  return { workspace, membership }
}

const ensureAdmin = (membership) => {
  if (membership.role !== 'admin') {
    throw new clientError({
      message: 'Only workspace admins can manage this channel',
      explanation: 'The current user is not an admin of this workspace',
      statusCode: StatusCodes.FORBIDDEN
    })
  }
}

const ensureValidChannelName = (name) => {
  const trimmedName = name?.trim()
  if (!trimmedName) {
    throw new clientError({
      message: 'Channel name is required',
      explanation: 'A valid channel name must be provided',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }
  return trimmedName
}

const ensureChannelNameAvailable = async (workspaceId, name, channelId) => {
  const existingChannel = await channelRepository.getByNameForWorkspace(
    workspaceId,
    name
  )
  if (existingChannel && existingChannel.id !== channelId?.toString()) {
    throw new clientError({
      message: 'Channel name already exists',
      explanation: 'Channel names must be unique within a workspace',
      statusCode: StatusCodes.CONFLICT
    })
  }
}

export const getChannelsService = async (workspaceId, userId) => {
  await getWorkspaceForMember(workspaceId, userId)
  const channels = await channelRepository.getAllByWorkspaceId(workspaceId)
  if (!channels) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }
  return channels
}

export const getChannelById = async (workspaceId, channelId, userId) => {
  await getWorkspaceForMember(workspaceId, userId)
  ensureValidObjectId(channelId, 'Channel')

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
  return channel
}

export const createChannelService = async (workspaceId, userId, name) => {
  await getWorkspaceForMember(workspaceId, userId)
  const trimmedName = ensureValidChannelName(name)
  await ensureChannelNameAvailable(workspaceId, trimmedName)

  const channel = await channelRepository.createForWorkspace(
    workspaceId,
    trimmedName
  )
  if (!channel) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }
  return channel
}

export const updateChannelService = async (
  workspaceId,
  channelId,
  userId,
  name
) => {
  const { membership } = await getWorkspaceForMember(workspaceId, userId)
  ensureAdmin(membership)
  ensureValidObjectId(channelId, 'Channel')
  const trimmedName = ensureValidChannelName(name)
  await ensureChannelNameAvailable(workspaceId, trimmedName, channelId)

  const channel = await channelRepository.updateForWorkspace(
    workspaceId,
    channelId,
    trimmedName
  )
  if (!channel) {
    throw new clientError({
      message: 'Channel not found',
      explanation: 'No channel exists with the provided ID in this workspace',
      statusCode: StatusCodes.NOT_FOUND
    })
  }
  return channel
}

export const deleteChannelService = async (workspaceId, channelId, userId) => {
  const { membership } = await getWorkspaceForMember(workspaceId, userId)
  ensureAdmin(membership)
  ensureValidObjectId(channelId, 'Channel')

  const channel = await channelRepository.deleteForWorkspace(
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
  return { id: channel.id, name: channel.name }
}
