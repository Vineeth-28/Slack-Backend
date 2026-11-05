import { StatusCodes } from 'http-status-codes'

import { enqueueBulkEmails } from '../service/bulkEmailService.js'
import {
  customErrorResponse,
  internalErrorResponse
} from '../utils/common/responseObject.js'

export const enqueueBulkEmailController = async (req, res) => {
  try {
    const result = await enqueueBulkEmails(req.body)

    return res.status(StatusCodes.ACCEPTED).json({
      success: true,
      message: 'Emails queued successfully',
      data: result
    })
  } catch (error) {
    console.error('Bulk email controller error:', error)

    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }

    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
