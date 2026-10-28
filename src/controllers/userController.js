import { StatusCodes } from 'http-status-codes'

import { signUpService } from '../service/userService.js'
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObject.js'

export const signUp = async (req, res) => {
  try {
    const user = await signUpService(req.body)

    // 2. Fixed: standard JSON response formatting wrapped in a single object
    return res.status(StatusCodes.CREATED).json({
      success: true,
      message: 'User Created Successfully',
      data: user
    })
  } catch (error) {
    console.log('user Controller error', error)

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }

    // 3. Fixed: Corrected the status method chaining for internal server errors
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
