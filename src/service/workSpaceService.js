import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import WorkspaceRepository from '../repositories/workspaceRepository.js'
import Channel from '../schema/channel.js'
import Workspace from '../schema/workSpace.js'
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

export const createWorkspaceService = async (workspaceData) => {
  if (!workspaceData?.name || workspaceData.name.trim().length < 3) {
    throw new clientError({
      message: 'Workspace name is required',
      explanation: 'Workspace name must be at least 3 characters long',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const joinCode = uuidv4().replaceAll('-', '').substring(0, 6)
  const response = await WorkspaceRepository.create({
    type: workspaceData.type,
    name: workspaceData.name,
    description: workspaceData.description,
    joinCode
  })

  await WorkspaceRepository.addMembertoWorkspace(
    response._id,
    workspaceData.owner,
    'admin'
  )
  const generalChannel = await Channel.create({ name: 'general' })
  return WorkspaceRepository.addChannelToWorkspace(
    response._id,
    generalChannel._id
  )
}

export const getWorkspaceUserIsMemberofService = async (userId) => {
  try {
    if (!userId || !mongoose.isValidObjectId(userId)) {
      throw new clientError({
        message: 'Invalid user ID',
        explanation: 'A valid user ID must be provided',
        statusCode: StatusCodes.BAD_REQUEST
      })
    }

    const response =
      await WorkspaceRepository.fetchAllWorkspaceByMemberId(userId)
    return response
  } catch (error) {
    if (error.statusCode) {
      throw error
    }

    console.log('Get workspace is member of service error', error)
    throw error
  }
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
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
    (member) => member.memberId.toString() === userId.toString()
  )
  if (!membership || membership.role !== 'admin') {
    throw new clientError({
      message: 'Only workspace admins can delete this workspace',
      explanation: 'The current user is not an admin of this workspace',
      statusCode: StatusCodes.FORBIDDEN
    })
  }

  return WorkspaceRepository.deleteWorkspace(workspace)
}

export const getWorkspaceService = async (workspaceId, userId) => {
  ensureValidObjectId(workspaceId, 'Workspace')
  ensureValidObjectId(userId, 'User')

  const workspace = await Workspace.findById(workspaceId)
    .populate('members.memberId', 'username email avatar')
    .populate('channels', 'name')

  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const membership = workspace.members.find(
    (member) => member.memberId && member.memberId._id
      ? member.memberId._id.toString() === userId.toString()
      : member.memberId.toString() === userId.toString()
  )

  if (!membership) {
    throw new clientError({
      message: 'Access denied',
      explanation: 'The current user is not a member of this workspace',
      statusCode: StatusCodes.FORBIDDEN
    })
  }

  return workspace
}

export const getWorkspaceByJoinCodeService = async (...args) => {
  const [firstArg, secondArg, thirdArg] = args
  let joinCode = firstArg
  let userId = secondArg

  if (typeof secondArg === 'object' && secondArg !== null) {
    if (secondArg.joinCode) {
      joinCode = secondArg.joinCode
    }
    userId = secondArg.userId ?? secondArg.memberId ?? thirdArg
  }

  if (typeof thirdArg !== 'undefined') {
    userId = thirdArg
  }

  if (!joinCode || typeof joinCode !== 'string') {
    throw new clientError({
      message: 'Join code is required',
      explanation: 'A valid workspace join code must be provided',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  ensureValidObjectId(userId, 'User')

  const workspace = await WorkspaceRepository.getWorkspaceByJoinCode(joinCode)
  const isAlreadyMember = workspace.members.some(
    (member) => member.memberId.toString() === userId.toString()
  )

  if (!isAlreadyMember) {
    await WorkspaceRepository.addMembertoWorkspace(workspace._id, userId, 'member')
    return Workspace.findById(workspace._id)
      .populate('members.memberId', 'username email avatar')
      .populate('channels', 'name')
  }

  return Workspace.findById(workspace._id)
    .populate('members.memberId', 'username email avatar')
    .populate('channels', 'name')
}

export const updateWorkspaceService = async (workspaceId, memberId, role) => {
  ensureValidObjectId(workspaceId, 'Workspace')
  ensureValidObjectId(memberId, 'Member')

  if (!['admin', 'member'].includes(role)) {
    throw new clientError({
      message: 'Invalid workspace role',
      explanation: 'Role must be either admin or member',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const workspace = await WorkspaceRepository.getById(workspaceId)
  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const memberIndex = workspace.members.findIndex(
    (member) => member.memberId.toString() === memberId.toString()
  )

  if (memberIndex === -1) {
    throw new clientError({
      message: 'Member not found',
      explanation: 'The requested member is not part of this workspace',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  workspace.members[memberIndex].role = role
  await workspace.save()
  return workspace
}

export const addMembertoWorkspaceService = async (workspaceId, memberId, role) => {
  ensureValidObjectId(workspaceId, 'Workspace')
  ensureValidObjectId(memberId, 'Member')

  if (role && !['admin', 'member'].includes(role)) {
    throw new clientError({
      message: 'Invalid workspace role',
      explanation: 'Role must be either admin or member',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  return WorkspaceRepository.addMembertoWorkspace(
    workspaceId,
    memberId,
    role || 'member'
  )
}

export const addChannelToWorkspaceService = async (workspaceId, channelName) => {
  ensureValidObjectId(workspaceId, 'Workspace')

  const trimmedName = channelName?.trim()
  if (!trimmedName) {
    throw new clientError({
      message: 'Channel name is required',
      explanation: 'A valid channel name must be provided',
      statusCode: StatusCodes.BAD_REQUEST
    })
  }

  const workspace = await WorkspaceRepository.getById(workspaceId)
  if (!workspace) {
    throw new clientError({
      message: 'Workspace not found',
      explanation: 'No workspace exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  const existingChannel = await Channel.findOne({ name: trimmedName })
  const channel = existingChannel || (await Channel.create({ name: trimmedName }))

  return WorkspaceRepository.addChannelToWorkspace(workspace._id, channel._id)
}