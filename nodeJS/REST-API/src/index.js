const express=require('express')
//const User=require('./models/user')
//const Task=require('./models/task')
const PORT=3000;
require('./db/mongoose')
const userRouter=require('./router/user')
const bcrypt=require('bcryptjs')

const app=express()
app.use(express.json())
app.use(userRouter)
app.get('/' , (req,res)=>{
    res.send('Task Manager app')
})

//ading new task to db
app.post('/tasks', (req,res)=>{
    const newTask=new Task(req.body)
    newTask.save()
    .then((response)=>{
        res.send(response)
    }) 
    .catch((error)=>{
        res.send(error)
    })
})
// adding new user to db 
/*
app.post('/users' , (req,res)=>{
    const newUser=new User(req.body)
    newUser.save()
    .then((response)=>{
        res.send(response)
        
    })
    .catch((error)=>{
        res.send(error)
    })
})

app.get ('/tasks',(req,res)=>{
    res.send('get all tasks')
})


app.get('/tasks/:id',(req,res)=>{
    res.send('getting specific task')
})

app.post('/tasks',(req,res)=>{
    res.send('new task added ')
})

app.patch('/tasks/:id' , (req,res)=>{
    res.send('specific task is update ')
})

app.delete('/tasks/:id' , (req,res)=>{
    res.send('specific task is deleted ')
})
*/
//deleting specific user 
/*app.delete('/user/:id' ,async(req,res)=>{
    const user = req.params.id;
    const deleteUser = await
     User.findOneAndDelete(id)
    if(!deleteUser)
    {
        res.status(404).send()
    }
    res.send(deleteUser)
})

*/
app.listen(PORT,()=>{
    console.log(`Server is running on port  ${PORT}`)

})

async function myEncryption()
{
    const pass='harshu123'
    const hashpass=await bcrypt.hash(pass,8)
    console.log(pass)
    console.log(hashpass)

    const isMatch=await bcrypt.compare('harshu123',hashpass)
    console.log(isMatch)
}

myEncryption() 