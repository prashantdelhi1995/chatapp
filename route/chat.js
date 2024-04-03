const express= require("express");
const userchat=require("../controller/chat");
const auth=require("../middleware/authorization");

const router=express.Router();
router.post("/chat",auth.authorization ,userchat.postChat);
router.get("/chat",auth.authorization, userchat.getChat);


module.exports=router