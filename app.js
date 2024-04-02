const express= require("express");

const Sequelize=require("sequelize");

const sequelize=require("./util/database");
const userRoute=require("./route/userRoute");
const bodyParser=require("body-parser");
const cors=require("cors")

const app= express();
app.use(cors());

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use("/user",userRoute);
app.use((req,res)=>{
    console.log(res.url);
    res.send(`<h1>this is not correct url and your url is ${res.url}</h1>`)

});



const PORT=3000;
(async () => {
    try {
      await sequelize.sync();
      app.listen(PORT , () => {
        console.log('Server is running on port ',PORT);
      });
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  })();