export const internalErrorResponse = () => {
  return {
    success: false,
    err: [],
    data: {},
    message: 'Internal Server Error'
  }
}

export const customErrorResponse = (error) => {
  if (!error.message && !error.explanation) {
    return internalErrorResponse(error)
  }
  return {
    success: false,
    err: error.explanation ?? [],
    data: [],
    message: error.message
  }
}

export const successResponse = (data, message) => {
  return {
    success: true,
    message: message,
    data,
    error: []
  }
}
