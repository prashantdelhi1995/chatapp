const sequelize= require("../util/database");
const user=require("../model/user");
const bcrypt=require("bcrypt");
module.exports.signup= async(req,res,next)=>{
    const t = await sequelize.transaction();
    const {name,email,password}=req.body;
    console.log(name,email,password);
    try {
        const existingUser = await user.findOne({ where: { Email: email }, transaction: t });
    
        if (existingUser) {
          await t.rollback();
          return res.status(400).send('Email already exists');
        }
    
        bcrypt.hash(password, 10, async (err, hash) => {
          try {
            const SignUp = await user.create({Name: name,Email :email, Password: hash }, { transaction: t });
            await t.commit();
            return res.status(201).json(SignUp);
          } catch (error) {
            await t.rollback();
            console.error('Error creating user:', error);
            return res.status(500).json({ error: 'Error creating user.' });
          }
        });
      } catch (error) {
        await t.rollback();
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Error creating user.' });
      }



}