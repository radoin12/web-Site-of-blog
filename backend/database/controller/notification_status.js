
const db = require("../db")
const { decrementCount } = require("./notification_count")



const getNotificationStatusJoinNotification=(req,res)=>{
    const userId=req.user.id
    const querry=`select ns.id,ns.notification_id, ns.isread,ns.isdelete,n.userId ,n.message,n.type,n.userName,n.createdAt,n.imageUser,n.postId from notification  as n inner join notification_status  as ns 
    on n.id=ns.notification_id  where user_id=? and isdelete=false  order by createdAt desc limit 12`
     db.query(querry,[userId],(err,data)=>{
        if (err) {
           res.status(505).send(err) 
        }
        else{
           
            res.status(200).send(data)
        }
     })
}

const markNotificationAsDelete=(req,res)=>{
 const notifyId=req.params.id 
 userId=req.user.id 
 const querryRead=`select * from notification_status where notification_id=? and user_id=?`
 db.query(querryRead,[notifyId,userId],(err,result)=>{
    if (err) {
        console.log(err,'err')
       return res.status(505).send(err)  
    }
    else{
        const querry=`update notification_status set isdelete=true where user_id=? and notification_id=?`
        
        db.query(querry,[userId,notifyId],(err,upDate)=>{
            if (err) {
                console.log(err,'err1')
               return res.send(err) 
            }
            else{
                if (result[0]&&!result[0].isread) {
                decrementCount(userId)
                }
                console.log(result[0],'delete')
              return res.json(result[0].notification_id)  
            }
        })
       
    }
 })
 
}

const markNotificationAsReadble=(req,res)=>{
    const notificationId=req.params.id
 
    const querry=`select * from notification_status where user_id=? and notification_id=? `
    db.query(querry,[req.user.id,notificationId],(err,results)=>{
        if (err) {
           
            res.status(500).send(err)
        }
        else{
            console.log(results[0],"reslts")
            const querryUpdate=`UPDATE notification_status set isread=true where user_id=? and notification_id=?`
            if (results[0]&&results[0].isread===0) {
              
                decrementCount(req.user.id)   
                db.query(querryUpdate,[req.user.id,notificationId],(err,data)=>{
                    if (err) {
                        console.log(err)
                        return res.status(500).send(err)
                    }
                    else{
                       console.log('is up dated')
                     
                           
                      
                         
                    }
                  
                })
            }
    
            return res.send(notificationId) 
           
            
          
        }
    })
}
module.exports={getNotificationStatusJoinNotification,markNotificationAsReadble,markNotificationAsDelete}