
const User= require("../model/user");
const jwt = require("jsonwebtoken");
module.exports.authorization=async (req,res,next)=>{
    try{
    const token = req.header("Authorization");
    const UserId=jwt.verify(token, "secretKey");
   const result= await User.findByPk(UserId.userId);
   req.user=result
    next()
    }
    catch(error){
        console.log(error);
    }



}