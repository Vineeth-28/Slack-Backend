import { StatusCodes } from 'http-status-codes'

import { getMessageService } from '../service/messageService.js'
import {
  customErrorResponse,
  internalErrorResponse,
  successResponse
} from '../utils/common/responseObject.js'

export const getMessage = async (req, res) => {
  try {
    const page = Number(req.query.page ?? 1)
    const limit = Number(req.query.limit ?? 20)
    const messages = await getMessageService(
      req.params.workspaceId,
      req.params.channelId,
      req.user,
      page,
      limit
    )

    return res
      .status(StatusCodes.OK)
      .json(successResponse(messages, 'Messages fetched successfully'))
  } catch (error) {
    console.error('Message controller error:', error)
    if (error.statusCode) {
      return res.status(error.statusCode).json(customErrorResponse(error))
    }
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(internalErrorResponse(error))
  }
}
