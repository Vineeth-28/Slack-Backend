import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'
import { v4 as uuidv4 } from 'uuid'

import WorkspaceRepository from '../repositories/workspaceRepository.js'
import Channel from '../schema/channel.js'
import clientError from '../utils/errors/clientErrors.js'

export const createWorkspaceService = async (workspaceData) => {
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
    const response =
      await WorkspaceRepository.fetchAllWorkspaceByMemberId(userId)
    return response
  } catch (error) {
    console.log('Get workspace is member of service error', error)
    throw error
  }
}

export const deleteWorkspaceService = async (workspaceId, userId) => {
  if (!mongoose.isValidObjectId(workspaceId)) {
    throw new clientError({
      message: 'Invalid workspace ID',
      explanation: 'A valid workspace ID must be provided',
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
