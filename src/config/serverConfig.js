import dotenv from 'dotenv'

dotenv.config()
export const PORT = process.env.PORT || 3000
export const NODE_ENV = process.env.NODE_ENV || 'development'
export const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/mydatabase'
export const JWT_SECRET = process.env.JWT_SECRET || 'SlackApp'

export const JWT_EXPIRY = process.env.JWT_EXPIRY || '1h'

export const SMTP_HOST = process.env.SMTP_HOST || ''
export const SMTP_PORT = Number(process.env.SMTP_PORT || 587)
export const SMTP_USER = process.env.SMTP_USER || ''
export const SMTP_PASS = process.env.SMTP_PASS || ''
export const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER
export const TEST_EMAIL =
  process.env.TEST_EMAIL || 'vineetsingh918@gmail.com'
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000'