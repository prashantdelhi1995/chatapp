const sequelize= require("../util/database");
const chat= require("../model/chat");
const user=require("../model/user");
module.exports.postChat=async(req,res,next)=>{
    try {
    const message=req.body.message;
    console.log(">>>>>>>",req.user)
    const textMessage= await chat.create({chat:message, name:req.user.Name  ,userId:req.user.Id});
    return res.status(201).json(textMessage);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"})
    }
}
module.exports.getChat=async(req,res,next)=>{
    try{
const message=await chat.findAll()
if(message!==null){
    return res.status(201).json({message})
}
   
}
catch(error){
    res.status(500).json({message:"something went worng"})
}
}