const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const multer=require('multer')

const router=new express.Router()
  //Profile pic

const upload=multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(file.originalname.endsWith('.jpg'))
        {
            return cb(new Error('Only jpg are allowed!!'))
        }
        cb(undefined,true)
    }
})


  // file upload 
  router.post('/users/me/pic',auth,upload.single('pic'),async(req,res)=>{
    console.log('in post')
    req.user.pic=req.file.buffer
    await req.user.save()
    res.send('picture upload successfully!!!!'),
    (error,req,res,next)=>{
        res.status(400).send({error:error.message})
    }
  })

  //view profile picture
router.get('/users/:id/pic',async(req,res)=>{
    try
    {
        const user=await User.findById(req.params.id)
        if(!user || !user.pic)
        {
            throw new Error('')
        }
        res.set('content-Type','image/jpg')
        res.send(user.pic)
    }catch(e)
    {
        res.status(404).send()
    }
})

//profile pic delete
  router.delete('/users/me/pic',auth,async(req,res)=>{
    console.log('======>'+req.user)
    req.user.pic=undefined
    await req.user.save()
    res.send('picture deleted!!')
  })

router.post('/users',(req,res)=>{
    const newUser=new User(req.body)
    newUser.save()
    .then((response)=>{
        res.send(response)
    })
    .catch((error)=>{
        res.send(error)
    })
      
 })
router.patch('/users/:id',(req,res)=>{
})

router.delete('/users/me',auth,async function(req,res){
    await Task.deleteMany({owner:req.user_id})
    await User.deleteOne({_id:req.user._id})
    res.send('user deleted!!!!')
})

//login
router.post('/users/login', async (req, res) => {
    try{
        console.log(req.body.email)
        console.log(req.body.password)
        const user = await User.checkUserLogin(req.body.email, req.body.password);
        const token = await user.genratAuthToken()
        res.status(201).send({ user,token })
        console.log('current token: ' + token)
        console.log('login Successful')
        // res.send({ user, token })
    }
    catch(e)
    {
        res.status(400).send('email id or password is wrong')
    }
})

//user logout from all sessions
router.post('/users/logoutall',auth,async(req,res)=>{
    req.user.tokens=[]
    await req.user.save()
    res.send(req.user)
})

// delete user
router.delete('/users/me',auth,async(req,res)=>{
    await User.findOneAndDelete({_id:req.user._id.toSting()})
    res.send('user deleted')
})

//user update
// router.put('/users/me',auth,async(req,res)=>{
//     const user= await User.findOneAndUpdate(req.user._id, req.body,{
//         New: true,
//         runValidators: true
//     }) 
//         if(!user)
//            throw new Error("can't update" )
//         res.send(user)
// })

router.put('/users/me',auth,async(req,res)=>{
     const user= await User.findById(req.user._id)
     Object.assign(user,req.body)
     req.user=user
 const cUser =await req.user.save()
    res.send(cUser)   

})
// user logout from current session
router.post('/users/logout',auth,async(req,res)=>{
    console.log('in logout router')
    console.log("======"+req.token)
    try{
        req.user.tokens =  req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })
        await req.user.save()
        res.send('logout successful!!!')
    }
    catch(e)
    {
        res.status(500).send()
    }
})

//authentication
router.get('/users/me',auth,(req,res)=>{
    res.send(req.user)
})

module.exports=router;