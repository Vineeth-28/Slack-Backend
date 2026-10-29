import dotenv from 'dotenv'

dotenv.config()
export const PORT = process.env.PORT || 3000
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'
  export const JWT_SECRET = process.env.JWT_SECRET || 'SlackApp'

  export const JWT_EXPIRY =process.env.JWT_EXPIRY || '1h'