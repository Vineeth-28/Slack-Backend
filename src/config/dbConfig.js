import mongoose from 'mongoose'

import { MONGO_URI } from './serverConfig.js'

export default async function connectDB() {
  await mongoose.connect(MONGO_URI)
  console.log('MongoDB connected')
}
