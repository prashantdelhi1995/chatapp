const express= require("express");
const signup=require("../controller/user");
const router=express.Router();
router.post("/signup", signup.signup);
module.exports=router