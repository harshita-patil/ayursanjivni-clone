const mongoose= require('mongoose')
const validator = require ('validator')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

  const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },

    email:{
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        validator(value)
        {
            if(!validator.isEmail(value))
            {
                throw new Error ('pleace enter a valid email id')
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
        validator(value)
        {
            if(value.toLowerCase().includes('password'))
            {
                throw new Error('password cant be password')
            }
        }
    },
    age:{
        type: Number,
        required:false,
        default:0,
        validator(value)
        {
            if(value<0)
            {
                throw new Error ('age can not be less then 0')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    pic:{
        type:Buffer
    }
  },
  {
   timestamps: true
  })

userSchema.virtual('tasks',{
    ref:'Task', // its model name
    localField:'_id',
    foreignField:'owner'
})

  userSchema.pre('save',async function(next){
    const currUser=this
    if (currUser.isModified('password'))
    {
         currUser.password=await bcrypt.hash(currUser.password,8)

    }
    next()
  })

    userSchema.statics.checkUserLogin=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user)
    {
         throw new Error('invalid email id')
    }
    const isMatch=await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error('invalid password')
    }
    return user
  }

userSchema.methods.genratAuthToken= async function(){
    const user=this
    const token=jwt.sign({_id:user._id.toString()},'thisisfirsttoken')
    console.log(token)
    user.tokens=await user.tokens.concat({token})
    await user.save()
    return token
}
userSchema.methods.toJSON=function(){
    const user=this
    const currUser=user.toObject()
    delete currUser.tokens
    delete currUser.password
    return currUser
}
  const User=mongoose.model('User',userSchema)
  module.exports=User;