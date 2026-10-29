import bcrypt from 'bcrypt'
import { StatusCodes } from 'http-status-codes'

import userRepository from '../repositories/userRepository.js'
import createJWT from '../utils/common/authUtils.js'
import clientError from '../utils/errors/clientErrors.js'
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


export const signInService = async(data) =>{

  try{
       const user = await userRepository.getbyEmail(data.email)
       if(!user){
          throw new clientError({
            explaination:'Invalid data send from the client',
            message:'No user found with registered email',
            Statuscode:StatusCodes.NOT_FOUND
          });
       }

   //match the incoming password with hash password
    const isMatch= bcrypt.compareSync(data.password , user.password);
    if(!isMatch){
      throw new clientError({
        explaination:'Invalid data sent from the client',
        message:'Invalid password try again',
        statusCode:StatusCodes.UNAUTHORIZED
      })
    }
    return {
      username:user.username,
      avatar:user.avatar,
      email:user.email,
      token:createJWT( {
        user: user._id,
        email:user.email
      })
    }

  }
  catch(error){
   console.log('User Service Error' , error)
  }
}