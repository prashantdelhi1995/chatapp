const Sequelize=require("sequelize")
// const sequelize= new Sequelize("chatapp", "root" , "123456",{
//     host:"localhost",
//     port:3306,
//     dialect: 'mysql',
    
// })
console.log(process.env.database)
const sequelize= new Sequelize(process.env.database, process.env.userName , process.env.password,{
    host:process.env.host,
    port:process.env.port,
    dialect: 'mysql',
    
})
module.exports= sequelize
