import { StatusCodes } from 'http-status-codes'

import { signInService,signUpService } from '../service/userService.js'
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObject.js'

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body)

    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User Created Successfully',
      data: {
        id: user.id,
        email: user.email,
        username: user.username,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    })
  } catch (error) {
    console.error('User controller error:', error)

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}

export const signIn = async (req, res) => {
  try {
    const response = await signInService(req.body)
    return res.status(StatusCodes.OK).json({
      success: true,
      message: 'User Signed Successfully',
      data:response
    })
  
  } catch (error) {
    console.error('User controller error:', error)

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
