import { v4 as uuidv4 } from 'uuid'

import WorkspaceRepository from '../repositories/workspaceRepository.js'
import Channel from '../schema/channel.js'

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


export const getWorkspaceUserIsMemberofService =async(userId)=>{
  try{
     const response = await WorkspaceRepository.fetchAllWorkspaceByMemberId(userId);
     return response;
  }
  catch(error){
    console.log('Get workspace is member of service error',error);
    throw error
  }
}