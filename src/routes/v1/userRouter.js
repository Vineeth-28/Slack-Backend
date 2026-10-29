import express from 'express'
import { StatusCodes } from 'http-status-codes'

import { signUp } from '../../controllers/userController.js'
import { userSignUpSchema } from '../../validators/userSchema.js'
import { validate } from '../../validators/zodValidator.js'

const router = express.Router()

router.get('/', (req, res) => {
  return res.status(StatusCodes.OK).json({
    message: '/Get users'
  })
})

router.post('/signup',validate(userSignUpSchema) ,signUp)

export default router
