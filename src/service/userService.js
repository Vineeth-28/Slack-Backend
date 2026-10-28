import userRepository from '../repositories/userRepository';
import { ValidationError } from '../utils/errors.js'; 

export const signUpService = async (data) => {
  try {
    const newUser = await userRepository.create(data);
    return newUser;
  } catch (error) {
    console.log('user service error', error);
    
    // 2. Mongoose/DB Validation Errors
    if (error.name === 'ValidationError') {
      throw new ValidationError(
        {
          error: error.errors
        },
        error.message
      );
    }
    

    if (error.name === 'MongoServiceError' && error.code === 11000) {
      throw new ValidationError({
        error: ['A user with same email or username already exists.']
      });
    }

    // Optional: Re-throw any other unexpected errors so they don't fail silently
    throw error;
  }
};
