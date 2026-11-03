import { StatusCodes } from 'http-status-codes'
import jwt from 'jsonwebtoken'

import { JWT_SECRET } from '../config/serverConfig.js'
import userRepository from '../repositories/userRepository.js'
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObject.js'

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.headers['x-access-token']

    if (!token) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explaination: 'Invalid data sent from the Client',
          message: 'No auth token Provided'
        })
      )
    }

    const response = jwt.verify(token, JWT_SECRET)

    if (!response) {
      return res.status(StatusCodes.FORBIDDEN).json(
        customErrorResponse({
          explaination: 'Invalid token send from the client',
          message: 'Invalid auth token'
        })
      )
    }

    // 1. Fetch user from the database
    const user = await userRepository.getById(response.user)

    // 2. ✅ CRITICAL FIX: Guard against null database records
    if (!user) {
      return res.status(StatusCodes.UNAUTHORIZED).json(
        customErrorResponse({
          explaination:
            'The user session is invalid or the account was deleted',
          message: 'User no longer exists'
        })
      )
    }

    // 3. Now it is perfectly safe to access the .id property
    req.user = user.id

    // Proceed to the next middleware or controller if the token is valid
    next()
  } catch (error) {
    console.error('Authentication middleware error:', error)

    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(
      internalErrorResponse({
        explaination: error.message || 'Internal Server Error',
        message: 'Internal Server Error'
      })
    )
  }
}
