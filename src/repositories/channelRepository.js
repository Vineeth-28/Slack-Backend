import Channel from '../schema/channel.js'
import Message from '../schema/message.js'
import Workspace from '../schema/workSpace.js'
import crudRepository from './crudRepository.js'

const channelRepository = {
  ...crudRepository(Channel),

  getAllByWorkspaceId: async (workspaceId) => {
    const workspace = await Workspace.findById(workspaceId).populate(
      'channels',
      'name createdAt updatedAt'
    )
    return workspace?.channels.filter(Boolean) ?? null
  },

  getByIdForWorkspace: async (workspaceId, channelId) => {
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      channels: channelId
    }).populate({
      path: 'channels',
      match: { _id: channelId },
      select: 'name createdAt updatedAt'
    })
    return workspace?.channels[0] ?? null
  },

  getByNameForWorkspace: async (workspaceId, name) => {
    const workspace = await Workspace.findById(workspaceId).populate(
      'channels',
      'name'
    )
    return (
      workspace?.channels
        .filter(Boolean)
        .find((channel) => channel.name.toLowerCase() === name.toLowerCase()) ??
      null
    )
  },

  createForWorkspace: async (workspaceId, name) => {
    const workspace = await Workspace.findById(workspaceId)
    if (!workspace) {
      return null
    }

    const channel = await Channel.create({ name })
    workspace.channels.push(channel._id)
    await workspace.save()
    return channel
  },

  updateForWorkspace: async (workspaceId, channelId, name) => {
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      channels: channelId
    })
    if (!workspace) {
      return null
    }

    return Channel.findByIdAndUpdate(
      channelId,
      { name },
      { new: true, runValidators: true }
    )
  },

  deleteForWorkspace: async (workspaceId, channelId) => {
    const workspace = await Workspace.findOne({
      _id: workspaceId,
      channels: channelId
    })
    if (!workspace) {
      return null
    }

    const channel = await Channel.findById(channelId)
    if (!channel) {
      return null
    }

    await Message.deleteMany({ channelId, workspace: workspaceId })
    workspace.channels.pull(channelId)
    await workspace.save()

    const isUsedByAnotherWorkspace = await Workspace.exists({
      channels: channelId
    })
    if (!isUsedByAnotherWorkspace) {
      await Message.deleteMany({ channelId })
      await Channel.findByIdAndDelete(channelId)
    }
    return channel
  }
}

export default channelRepository
