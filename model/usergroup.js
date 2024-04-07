const Sequelize=require("sequelize");
const sequelize= require("../util/database");
const userGroup=sequelize.define("userGroup",{
    id:{type:Sequelize.INTEGER,
        autoIncrement:true,
        allowNull:false,
        primaryKey:true
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    groupId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }
})
module.exports=userGroup;