// FIXED: Changed the import alias name from 'bycrpt' to 'bcrypt'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Email is Required'],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        'Please provide a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is Required'],
      minlength: 6
    },
    username: {
      type: String,
      required: [true, 'User name is required'],
      unique: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        'User name can only contain letters, numbers, and underscores'
      ]
    },
    avatar: {
      type: String
    }
  },
  { timestamps: true }
)

userSchema.pre('save', async function saveUser() {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 9);
  }

  if (this.isNew || this.isModified('username')) {
    this.avatar = `https://robohash.org/${this.username}`;
  }
});

const User = mongoose.model('User', userSchema)
export default User
