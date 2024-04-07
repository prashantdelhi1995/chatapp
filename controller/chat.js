const sequelize= require("../util/database");
const chat= require("../model/chat");
const user=require("../model/user");
const { Op } = require('sequelize');
module.exports.postChat=async(req,res,next)=>{
    try {
    const message=req.body.message;
    const groupId=req.query.groupId;
    
    const textMessage= await chat.create({chat:message, name:req.user.Name  ,userId:req.user.Id , groupId});
    return res.status(201).json(textMessage);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"})
    }
}
module.exports.getChat=async(req,res,next)=>{
    try{
 const groupId=req.query.groupId;       
 let lastElement=req.query.lastElement ||0; 
     
const message=await chat.findAll({
    where: {
        id: {
            [Op.gt]: lastElement , groupId:groupId
        }
        
        
    }
})
console.log("message is",message);
if(message!==null){
    return res.status(201).json({message})
}
   
}
catch(error){
    res.status(500).json({message:"something went worng"})
}
}