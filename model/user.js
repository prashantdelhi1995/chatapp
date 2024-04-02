const Sequelize= require("sequelize")
const sequelize= require("../util/database");
const user=sequelize.define("user",{
    Id:{
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    Password:{
        type:Sequelize.STRING,
        allowNull:false
    }

})
module.exports=user;