const mongoose=require('mongoose')
const URL='mongodb://127.0.0.1:27017/TaskManager'
mongoose.connect(URL)
console.log('connected to db......')