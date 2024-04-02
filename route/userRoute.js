const express= require("express");
const user=require("../controller/user");
const router=express.Router();
router.post("/signup", user.signup);
router.post("/login",user.postUserLogin)
module.exports=router