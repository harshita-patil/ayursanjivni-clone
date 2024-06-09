const mongoose = require('mongoose')

const taskSchema = mongoose.Schema({ 
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed:{
        type: String,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User' // its model name
    }
});

const Task=mongoose.model('Task',taskSchema)
module.exports = Task;