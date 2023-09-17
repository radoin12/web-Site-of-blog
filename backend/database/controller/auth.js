
const bcrypt=require('bcryptjs')
const db = require('../db.js');

const jsonwebtoken=require('jsonwebtoken')
require('dotenv').config();

var cookieParser = require('cookie-parser');
const createTriggerForNewUser= require('./declancher/declancher.js');
const Register=async(req,res)=>{
 
db.query("select * from users where email=?",req.body.email,(err,data)=>{
  if(err) return res.send(err) ;
   if(data.length>0){
     return res.send('email exist')
   }
   else{
    const { name, email,password,image}=req.body
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(password , salt);
    db.query("INSERT INTO users SET name=?,email=?,password=?,image=? ",[name,email,hash,image], (err, result) => {
      if (err) {
        console.log("error: here an error", err);
      
        return res.send(err)
      }
      else{
        db.query("select * from users where id=?",[result.insertId],(err,dataResult)=>{
          if (err) {
            return res.send(err)
          }
          else{
          
            const {password,...others}=dataResult
            createTriggerForNewUser(others[0].id)
            res.send(others[0])
          }
        })
        
  
      }
    
// Save user in the database


 })

   }
  })
     // Create a user
   
  
 

}






 const Login=(req,res)=>{
   const sql="SELECT * FROM users WHERE email=?"
   db.query(sql,req.body.email,(err,data)=>{
    if(err) {
      console.log(err)
      res.send(err)
    }
    if (data.length===0) {
    return  res.status(408).json('check your password or email') 
    }
   
   
   
    const isCorectPassword= bcrypt.compareSync(req.body.password,data[0].password)
     
    if (!isCorectPassword) {
    return   res.status(409).send("check your password or email")
    }
    const token=jsonwebtoken.sign({id:data[0].id,img:data[0].image,name:data[0].name,email:data[0].email,isAdmin:data[0].isAdmin},process.env.secriteJsonWebToken)

    // const {password,...others}=data[0]
    res.cookie("accessToken",token,{
      httpOnly:true
    }).send({"accessToken":token})
    
   })

}
 const Logout=(req,res)=>{
   
   res.clearCookie('accessToken').send('you are logout ')
}
module.exports={Login,Logout,Register}