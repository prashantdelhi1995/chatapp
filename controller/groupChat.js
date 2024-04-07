const sequelize= require("../util/database");
const chat= require("../model/chat");
const user=require("../model/user");
const group=require("../model/group");
const userGroup=require("../model/usergroup");
const { Op } = require('sequelize');
const { get } = require("../route/userRoute");
 async function createGroup (req,res,next){
    try{
    const groupName=req.body.groupName;
    const groupUsers=req.body.groupUsers;
    console.log(">>>>>>>>",groupName,groupUsers,req.user)


    const groupPresent =await group.findOne({where:{groupName:groupName}});
    if(groupPresent){
      return res.status(400).json({sucess:false, message:"group name is already present"})
    }
    if (!groupUsers.includes(req.user.Id.toString())) {
        groupUsers.push(req.user.Id);
    }
    const newGroup= await group.create({groupName})
    if (groupUsers.length>0){
        await Promise.all(groupUsers.map(async (userId) => {
            // Check if the user exists
            const user1 = await user.findByPk(+userId);
            if (user1) {
                // Add user to the group
                await userGroup.create({ userId: +userId, groupId: newGroup.id });
            }

    }))
    
}
return res.status(200).json({ success: true, message: "Group created successfully", group: newGroup });
}
catch(error){
    console.log(error)
    res.status(400).json({message:"something went wrong",error})
}
}
async function getAllMember(req, res, next) {
    try {
        const groupId = req.query.groupId;
        const members = await userGroup.findAll({
            where: { groupId: groupId },
            include: [{ model: user, attributes: ['Name'] }] // Include user table to fetch user names
        });

        // Extracting relevant data and sending back as JSON response
        const formattedMembers = members.map(member => ({
            userId: member.userId,
            userName: member.user.name // Accessing user name from included user table
        }));

        return res.json({allMember:formattedMembers});
    } catch (error) {
        console.log(error)
    }
}
async function allGroup(req,res,next){
    try{
    const allGroup=await group.findAll({userId:req.user.userId})
    return res.json(allGroup);


    }
    catch(error){
        console.log(error);
    }
}



async function allUser(req,res,next){
    try{
    const allUser=await user.findAll({attributes:["Id","Name"]})
    return res.json(allUser);


    }
    catch(error){
        console.log(error);
    }
}
async function getChat(req,res,next){
    try{
    let id=req.params.id;
    let lastElement=req.params.lastElement ||0; 
    
    console.log("id==",id)
    const messages = await chat.findAll({
        where: {
          id: {
            [Op.gt]: lastElement
          },
          groupId: id// Replace yourGroupId with the actual groupId value
        }
      });
        if(messages!==null){
            return res.status(201).json({messages})
        }
    
    }
    catch(error){
        console.log(error);
        res.status(500).json({"message":"chat did not found "})

    }
    
    
}
async function postChat(req,res,next){
    try {
    const message=req.body.message;
    console.log("message=",message);
    const groupId=req.body.groupId;
    console.log("groupId=",groupId);

    
    const textMessage= await chat.create({chat:message, name:req.user.Name  ,userId:req.user.Id , groupId});
    return res.status(201).json(textMessage);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"})
    }
}


 module.exports={createGroup, getAllMember, allUser, allGroup, getChat, postChat};

