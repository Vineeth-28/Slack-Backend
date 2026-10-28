import userRepository from '../repositories/userRepository.js'
import ValidationError from '../utils/errors/validation.error.js'

export const signUpService = async (data) => {
  try {
    const newUser = await userRepository.create(data)
    return newUser
  } catch (error) {
    if (error.name === 'ValidationError') {
      throw new ValidationError({
        error: error.errors
      })
    }

    if (error.code === 11000) {
      throw new ValidationError({
        error: {
          duplicate: {
            message: 'A user with the same email or username already exists.'
          }
        }
      })
    }

    throw error
  }
}
