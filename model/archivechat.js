const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const archivechat=sequelize.define('archivechat',{
    id: {
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        type: Sequelize.INTEGER
    },
    chat: {
        allowNull: false,
        type: Sequelize.STRING
    },
    name:{
        allowNull: false,
        type: Sequelize.STRING
    },
    ImageUrl:{
        
        type:Sequelize.BOOLEAN,
        defaultValue:false
    }
})

module.exports=archivechat