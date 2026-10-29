import { StatusCodes } from 'http-status-codes'

import { customErrorResponse } from '../utils/common/responseObject.js'

export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      await schema.parseAsync(req.body)
      next()
    } catch (error) {
      console.error('Validation error in zod validation', error)

      // Format Zod errors into a clean, readable structure
      const explanation = error.errors
        ? error.errors.map((err) => `${err.path.join('.')}: ${err.message}`)
        : [error.message || 'Invalid request data']

      return res.status(StatusCodes.BAD_REQUEST).json(
        customErrorResponse({
          message: 'Validation error',
          explanation: explanation // Pass the details to your custom response
        })
      )
    }
  }
}
