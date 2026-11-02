import mongoose from 'mongoose'
const messageSchema = new mongoose.Schema({
  body: {
    type: String,
    required: [true, 'Message body is requried']
  },
  image: {
    type: String
  },
  channelId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Channel',
    required: [true, 'Channel Id is required']
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    requried: [true, 'Sender Id is requried']
  },
  workspace: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Workspace',
    required: [true, 'Workspace is required']
  }
})

const message = mongoose.model('Message', messageSchema)
export default message
