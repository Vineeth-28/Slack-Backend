import { createMessageService } from '../service/messageService.js'
import {
  NEW_MESSAGE_EVENT,
  NEW_MESSAGE_EVENT_ALIAS
} from '../utils/common/eventConstants.js'

export default function messageSocketController(io, socket) {
  for (const eventName of [NEW_MESSAGE_EVENT, NEW_MESSAGE_EVENT_ALIAS]) {
    socket.on(eventName, async (data, callback) => {
      try {
        const message = await createMessageService(data)
        io.emit(eventName, message)
        callback?.({
          success: true,
          message: 'Message created successfully',
          data: message
        })
      } catch (error) {
        console.error('Message socket controller error:', error)
        callback?.({
          success: false,
          message: error.message || 'Failed to create message'
        })
      }
    })
  }
}
