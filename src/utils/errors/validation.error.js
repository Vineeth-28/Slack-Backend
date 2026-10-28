import { StatusCodes } from 'http-status-codes'

class ValidationError extends Error {
  constructor(errorDetails) {
    // 1. Pass a generic or default message to the parent Error class
    super('Validation failed')

    // 2. Properly set the error name
    this.name = 'ValidationError'

    // 3. Map out the error details into a flat array of explanations
    let explanation = []
    if (errorDetails && errorDetails.error) {
      Object.keys(errorDetails.error).forEach((key) => {
        explanation.push(errorDetails.error[key])
      })
    }
    this.explanation = explanation

    // 4. Assign the correct HTTP status code using http-status-codes
    this.statusCode = StatusCodes.BAD_REQUEST
  }
}

export default ValidationError
