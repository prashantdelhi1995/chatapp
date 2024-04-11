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
    },
    isAdmin:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        default:false
    }
})
module.exports=userGroup;