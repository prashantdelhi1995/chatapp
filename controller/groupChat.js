const sequelize= require("../util/database");
const chat= require("../model/chat");
const user=require("../model/user");
const group=require("../model/group");
const userGroup=require("../model/usergroup");
const { Op } = require('sequelize');
const { get } = require("../route/userRoute");

const io = require("socket.io")(5000, {
    cors: {
      origin: ["http://localhost:3000","http://127.0.0.1:5500"],
      methods: ["GET", "POST"],
      allowedHeaders: ["my-custom-header"],
      credentials: true,
    },
  });


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
            let isAdmin=false
            if(user1.Id==req.user.Id){
                isAdmin=true
            }
            if (user1) {
                // Add user to the group
                await userGroup.create({ userId: +userId, groupId: newGroup.id, isAdmin });
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
        console.log("groupId",groupId);
        const members = await userGroup.findAll({where:{groupId:groupId},
             include: [{ model: user, attributes: ['Name'] }]} // Include user table to fetch user names
        );
        
        
        const formattedMembers = members.map(member =>  {
            
            
            return {
            userId: member.userId,
            userName: member.user.Name ,
            groupId:member.groupId,
            isAdmin:member.isAdmin// Accessing user name from included user table
        }});
      

        return res.json({allMember:formattedMembers,totalUser:members.length});
    } catch (error) {
        console.log(error)
    }
}





async function allGroup(req,res,next){
    try{
    const allGroup = await userGroup.findAll({
        where: {
          userId: req.user.Id
        },
        include: {
          model: group,
          attributes: ['id', 'groupName']
        }
      });
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

io.on("connection", (socket) => {
    socket.on("getMessages", async (groupId) => {
      try {
        
        const messages = await chat.findAll({
          where: { groupId: groupId },
        });
        console.log("Request Made");
        io.emit("messages", messages);
      } catch (error) {
        console.log(error);
      }
    });
  });




// async function getChat(req,res,next){
//     try{
//     let id=req.params.id;
//     let lastElement=req.params.lastElement ||0; 
    
//     console.log("id==",id)
//     const messages = await chat.findAll({
//         where: {
//           id: {
//             [Op.gt]: lastElement
//           },
//           groupId: id// Replace yourGroupId with the actual groupId value
//         }
//       });
//         if(messages!==null){
//             return res.status(201).json({messages})
//         }
    
//     }
//     catch(error){
//         console.log(error);
//         res.status(500).json({"message":"chat did not found "})

//     }
    
    
// }
async function postChat(req,res,next){
    try {
    const message=req.body.message;
   
    const groupId=req.body.groupId;
   

    
    const textMessage= await chat.create({chat:message, name:req.user.Name  ,userId:req.user.Id , groupId});
    return res.status(201).json(textMessage);
    }
    catch(err){
        console.log(err);
        return res.status(500).json({message:"something went wrong"})
    }
}
async function deletegroup(req,res,next){
    try{
    id=req.params.id
    const group=group.findByPk({id:id});
    if (group){
        group.destroy();
        chat.destroy({where:{"groupId":id}});
        userGroup.destroy({where:{groupId:id}})
        res.status(200).json({"message":"successfully group is deleted"});
    }
}catch(error){
    console.log(error)
    res.status(500).json({message:"group hasn't deleted there is some problem"});
}
   

}
async function addAdmin(req,res,next) {
    try{
        console.log("add admin is called");
    const ids = req.body.selectedGroupIds;
    const groupId = req.body.groupId;

    const updatePromises = ids.map(async (id) => {
        await userGroup.update({ isAdmin: true }, { where: { userId: id, groupId: groupId } });
    });

    const updatedResults=await Promise.all(updatePromises);
    res.status(200).json({"message":"admin is updated","data":updatedResults});
}
catch(error){
    console.log(error);
    res.status(400).json({message:"admin is not getting updated"})
}
}

//non member function
async function getNonGroupMembers(req, res, next) {
    try {
        const groupId = req.query.groupId; // Retrieve groupId from query parameters

        // Fetch all members of the specified group
        const groupMembers = await userGroup.findAll({ where: { groupId: groupId } });

        // Extract Ids of group members
        const groupMemberIds = groupMembers.map(member => member.userId);

        // Fetch all users from the database who are not members of the group
        const nonGroupMembers = await user.findAll({
            where: { Id: { [Op.notIn]: groupMemberIds } },
            attributes: ['Id', 'Name']
        });

        // Return the list of non-group members
        return res.status(200).json({ nonGroupMembers });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

async function addMemberIntoGroup(req,res,next){
    try{
    groupId=req.body.groupId;
    userIds=req.body.selectedUserIds;
    console.log("groupId and userIDs",groupId, userIds);
    const MemberAdded  =userIds.map(async (userId) => {
        userGroup.create({groupId:groupId,userId:userId,isAdmin:false})
    }); 
    res.status(200).json({"message":"user added successfully",MemberAdded});
}
catch(error){

}


}

async function leftGroup(req,res,next){
    try{
    groupId=req.params.groupId;
   const leftGroup= await userGroup.destroy({where:{groupId:groupId,userId:req.user.Id}})
    
    
   
    res.status(200).json({"message":"left group successfully",leftGroup});
}
catch(error){
    res.status(400).json({"message":"you didn't left the group there is some error"});

}


}







 module.exports={
    createGroup, 
    getAllMember, 
    allUser,
     allGroup, 
     
    postChat,
    deletegroup,
    addAdmin,
   addMemberIntoGroup,
   getNonGroupMembers,
   leftGroup 
};

