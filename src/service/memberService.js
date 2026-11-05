import { StatusCodes } from 'http-status-codes'
import mongoose from 'mongoose'

import userRepository from '../repositories/userRepository.js'
import WorkspaceRepository from '../repositories/workspaceRepository.js'
import clientError from '../utils/errors/clientErrors.js'

export const isMemberPartOfWorkspace = async (workspaceId, memberId) => {
  if (
    !workspaceId ||
    !mongoose.isValidObjectId(workspaceId) ||
    !memberId ||
    !mongoose.isValidObjectId(memberId)
  ) {
    throw new clientError({
      message: 'Invalid workspace or member ID',
      explanation: 'Valid workspace and member IDs must be provided',
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

  const isUserMember = workspace.members.some(
    (member) => member.memberId.toString() === memberId.toString()
  )

  if (!isUserMember) {
    throw new clientError({
      message: 'User is not a member of the workspace',
      explanation: 'The requested user is not a member of this workspace',
      statusCode: StatusCodes.UNAUTHORIZED
    })
  }

  const user = await userRepository.getById(memberId)
  if (!user) {
    throw new clientError({
      message: 'Member not found',
      explanation: 'No user exists with the provided ID',
      statusCode: StatusCodes.NOT_FOUND
    })
  }

  return user
}
