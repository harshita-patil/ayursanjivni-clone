const express=require('express')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/tasks',auth,async(req,res)=>{
    try{
        const newTask=new Task({
            ...req.body,
            owner:req.user._id
        })
        console.log(newTask)
        await newTask.save()
        res.send(newTask)
    }
    catch(e)
    {
        res.status(401).send(e)
    }
})

router.get('/tasks',(req,res)=>{
    res.send('get all tasks')
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _taskId=req.params.id
    const task=await Task.findOne({_id:_taskId,owner:req.user._id})
    if(!task)
    {
        res.send('No task found ')
    }
    res.send(task)
})

router.post('/tasks',(req,res)=>{
    res.send('new task added')
})

router.patch('/tasks/:id',auth,async(req,res)=>{
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})
    if(!task)
    {
        res.send('No task found to update')
    }
    await Object.assign(task,req.body)
    await task.save()
    res.send(task)   
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
    res.send('specific task is deleted')
})

module.exports=router;