const User=require('../models/user')
const jwt=require('jsonwebtoken')
const auth=async function(req,res,next){
    
    const token=req.header('Authorization').replace('Bearer ','')
    console.log('current auth token----------'+token)
    const decode=jwt.verify(token,'thisisfirsttoken')
    const user=await User.findOne({_id:decode._id,'tokens.token':token})
    if(!user)
    {
        throw new Error('invalid token')
    }
    
    req.token=token
    req.user=user
    next()
}

module.exports=auth   


// const User = require('../models/user');
// const jwt = require('jsonwebtoken');

// const auth = async function(req, res, next) {
//     const token = req.header('Authorization');
//     if (!token) {
//         return res.status(401).send('Authorization header is missing.');
//     }

//     const tokenWithoutBearer = token.replace('Bearer ', '');
//     console.log('current auth token: ' + tokenWithoutBearer);

//     try {
//         const decode = jwt.verify(tokenWithoutBearer, 'thisisfirsttoken');
//         const user = await User.findOne({ _id: decode._id, 'tokens.token': tokenWithoutBearer });

//         if (!user) {
//             throw new Error('invalid token');
//         }

//         req.token = tokenWithoutBearer;
//         req.user = user;
//         next();
//     } catch (error) {
//         res.status(401).send('Authentication failed: ' + error.message);
//     }
// };

// module.exports = auth;
