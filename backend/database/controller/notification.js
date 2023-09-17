const { response } = require("express");
const db = require("../db");
const {assosiateExistantUser, assosierNewUser} = require("./declancher/intialstatus.js");




// display notification
const displayNotification=(req,res)=>{
  const querryDisplayNotififcation= `select * from notification ORDER BY createdAt DESC LIMIT 12 `
  db.query(querryDisplayNotififcation,(err,result)=>{
    if (err) {
       return res.status(505).send(err) 
    }
    else{
      return   res.status(200).send(result)
    
    }
  })
}


// add new Notification
const AddNewNotification=(io,datas)=>{
    const cretaeListeNotification=`INSERT INTO notification set userId=?, postId=?,message=?,
  type=?,userName=?,imageUser=?`

;

     
        
        db.query(cretaeListeNotification,[datas.userId,datas.postId,datas.message,datas.type,datas.userName,datas.imageUser],(err,result)=>{
          if (err) {
           
            return ;
          }
          else{
            const getId=result.insertId
            const queryNotRes=`select * from notification where id=?`

            db.query(queryNotRes,[getId],(err,data)=>{
              if (err) {
               
                return ;
              }
              else{

                console.log('working',data[0])
                switch (data[0].type) {
             
                  
                    case 'AddComment':
                      io.emit('emitCommentAdd',data[0])
                      break;
                      case 'DeleteComment':
                        
                   
                      io.emit('removeComment',data[0])
                      break; 
                          
              
                default:
                  break;
              }
              assosiateExistantUser(getId)
              }
            })
       
        
          }
        })
    
}
const newNotificationBlog=(io,data)=>{
        let cretaeListeNotification
        console.log(data.userId)
        const{userId,postId,message,type,userName,imageUser}=data

    
         cretaeListeNotification=`INSERT INTO notification  set userId=?, postId=?, message=?,
        type=?,userName=?,imageUser=?` ;
    
   
    db.query(cretaeListeNotification,[userId,postId,message,type,userName,imageUser],(err,result)=>{
   if (err) {
     console.log(err,'error handler  add blog ')
   }
   else{
    const getId=result.insertId
    const querryRes=`select * from notification where id=?`
    db.query(querryRes,[getId],(err,response)=>{
        if (err) {
          return ;  
        }
        else{
          
         
            switch (response[0].type) {
                case "removeBlog":
                 
                  io.emit('RemoveBlog',response[0])
                  break;
                  case "addProduct":
                    io.emit('newProduct',response[0])
                    break;
                    case "UpdateProduct":
                        io.emit('UpDateProduct',response[0])
                        break;
                   
              
                default:''
                  break;
              }
                 // assosiate new user with new notifiction
             assosiateExistantUser(getId)
        }
    })
   
   }
    })
   

}

const newNoticationUser=(io,data)=>{
   
    const cretaeListeNotification=`INSERT INTO notification set userId=?, message=?,
    type=?,userName=?,imageUser=?`
  
  ;
    const{userId,message,type,userName,imageUser}=data
   console.log('new user',data)
    db.query(cretaeListeNotification,[userId,message,type,userName,imageUser],(err,results)=>{
        if (err) {
            console.log('err',err)
       
        }
        else{
            const getid=results.insertId
            console.log(getid,'id!')
           
          
            const querryRes=`select * from notification where id=?`
            db.query(querryRes,[getid],(err,response)=>{
                if (err) {
                    console.log(err,'err')
                    
                }
                else{
                   
                    console.log('im here',response)
                    switch (data.type) {
                        case "addUser":
                          
                         
                           io.emit('addUser',response[0])
                           console.log('mistake')
                          
                          break;
                          case "DeleteUsers":
                         
                           
                            io.emit('deleteUsers',response[0])
                       
                           break;
                           case "UpdateUser":
                            io.emit('UpdateUser',response[0])
                           break;
                      
                        default:
                          break;
                      }
                    
                      assosiateExistantUser(response[0].id)
                }
            })
        
         
        }
      })
}


module.exports={AddNewNotification,newNotificationBlog,newNoticationUser,displayNotification}