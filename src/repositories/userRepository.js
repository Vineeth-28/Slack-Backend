import User from '../schema/user.js'
import crudRepository from './crudRepository.js'

const userRepository ={
    ...crudRepository(User),
    getbyEmail  :async function (email){
        const user = await User.findOne({email})
        return user
    },
    getByUsername:async function (username){
            const user = await user.findOne({username})
            return user;
        }
    }

export default userRepository()