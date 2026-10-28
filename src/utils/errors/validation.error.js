import { StatusCodes } from 'http-status-codes'

class ValidationError extends Error {
  constructor(errorDetails) {
    super('Validation failed')

    this.name = 'ValidationError'
    this.explanation = Object.values(errorDetails?.error ?? {}).map((error) =>
      typeof error === 'object' && error !== null ? error.message : error
    )
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

export default ValidationError
