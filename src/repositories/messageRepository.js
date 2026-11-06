import Message from '../schema/message.js'
import crudRepository from './crudRepository.js'

const messageRepository = {
  ...crudRepository(Message),

  getPaginationMessage: async (messageParams, page, limit) => {
    return Message.find(messageParams)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('senderId', 'username email avatar')
  }
}

export default messageRepository
