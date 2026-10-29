import  jwt  from "jsonwebtoken"

import {JWT_SECRET,} from '../../config/serverConfig.js'
import {JWT_EXPIRY}from '../../config/serverConfig.js'


export const createJwt =(payload) =>{
  return jwt.sign(payload ,JWT_SECRET,{
   expiresIn: JWT_EXPIRY
  })   
}

export default createJwt