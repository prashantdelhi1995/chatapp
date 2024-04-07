const Sequelize=require("sequelize");
const sequelize=require('../util/database')
const group=sequelize.define("group",{
   id: {type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        allowNull:false
        },
    groupName:{
        type:Sequelize.STRING,
        allowNull:false
        }

  });
  module.exports=group;
