const express=require("express");
const router=express.Router();
const auth=require("../middleware/authorization");
const groupChat=require("../controller/groupChat")
router.post("/creteGroup",auth.authorization, groupChat.createGroup);
router.get("/getMember",auth.authorization,groupChat.getAllMember);
router.get("/allUser",auth.authorization, groupChat.allUser);
router.get("/allGroup",auth.authorization, groupChat.allGroup);
//router.get("/getChat/:id/:lastElement",auth.authorization, groupChat.getChat);
router.post("/postChat/",auth.authorization, groupChat.postChat);
router.post("/addAdmins",auth.authorization,groupChat.addAdmin)
router.get("/nonMember",auth.authorization,groupChat.getNonGroupMembers);
router.post("/addMember",auth.authorization,groupChat.addMemberIntoGroup);
router.delete("/leftGroup/:groupId",auth.authorization,groupChat.leftGroup);







module.exports =router;