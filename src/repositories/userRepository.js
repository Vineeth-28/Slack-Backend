import User from '../schema/user.js'
export const getUserByEmail = async (email)=>{
    const user = await User.findOne ({email})
    return user
}

export const getUserByName = async(name)=>{
    const user = await User.findOne({username:name})
    return user
}

export const createUser = async (user) => {

    const newUser = await User.create({
        user
    })
    return newUser;
}

 export const getUser = async() => {
    const users= await User.find();
    return users
 }

 export const getUserById = async (id) => {
    const users = await User.findById({id
        })
        return users
 }

 export const deleteUser = async(id) => {
    const users = await User.deleteOne(id)
    return users;
 }

 export const UpdateUser = async (id, user) => {
    const users = await User.updateOne({ userId:id , username:user})
    return users;
 }
