const sequelize= require("../util/database");
const user=require("../model/user");
const bcrypt=require("bcrypt");
const jwt = require("jsonwebtoken")
function generateAccessToken(id, email) {
  return jwt.sign({ userId: id, email: email }, "secretKey");
}
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

module.exports.postUserLogin= async function postUserLogin(req, res, next) {
  const { email, password } = req.body;
  console.log(email, password);

  try {
    const user1 = await user.findOne({ where: { Email: email } });

    if (!user1) {
      return res.status(404).json({
        success: false,
        message: "User doesn't Exists!",
      });
    }

    bcrypt.compare(password, user1.Password, async (err, result) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Something went Wrong!" });
      }

      if (result == true) {
        return res.status(200).json({
          success: true,
          message: "Login Successful!",
          token: generateAccessToken(user1.Id, user1.Email)
        });
      } else {
        return res.status(401).json({
          success: false,
          message: "Password Incorrect!",
        });
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Something went Wrong!" });
  }
}
