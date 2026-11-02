import { StatusCodes } from 'http-status-codes'

import User from '../schema/user.js'
import Workspace from '../schema/workSpace.js'
import clientError from '../utils/errors/clientErrors.js'
import crudRepository from './crudRepository.js'

const WorkspaceRepository = {
  ...crudRepository(Workspace),

  getWorkspaceByName: async function (workspaceName) {
    const workspace = await Workspace.findOne({
      name: workspaceName
    })
    if (!workspace) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'Workspace not Found',
        statusCode: StatusCodes.NOT_FOUND
      })
    }
    return workspace
  },

  getWorkspaceByJoinCode: async function (joinCode) {
    const workspace = await Workspace.findOne({
      joinCode
    })
    if (!workspace) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'Workspace not Found',
        statusCode: StatusCodes.NOT_FOUND
      })
    }
    return workspace
  },

  addChannelToWorkspace: async function (workspaceId, channelName) {
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'Workspace Not found',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    // Prevents duplicate channel references
    if (!workspace.channels.includes(channelName)) {
      workspace.channels.push(channelName)
      await workspace.save()
    }
    return workspace
  },

  addMembertoWorkspace: async function (workspaceId, memberId, role) {
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'Workspace Not found',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    const isValidUser = await User.findById(memberId)
    if (!isValidUser) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'User Not found',
        statusCode: StatusCodes.NOT_FOUND
      })
    }

    // FIXED: Corrected spelling to 'workspace.members' and fixed syntax error
    const isMemberAlreadyPartOfWorkspace = workspace.members.find(
      (member) => member.memberId.toString() === memberId.toString()
    )

    if (isMemberAlreadyPartOfWorkspace) {
      throw new clientError({
        explaination: 'Invalid data sent from client',
        message: 'User Already a part of Workspace',
        statusCode: StatusCodes.BAD_REQUEST 
      })
    }

    workspace.members.push({
      memberId,
      role
    })

    await workspace.save()
    return workspace
  },

  fetchAllWorkspaceByMemberId: async function (memberId) {
   
    const workspaces = await Workspace.find({
      'members.memberId': memberId
    }).populate('members.memberId', 'Username ,email,avatar')
    return workspaces
  }
}

export default WorkspaceRepository
