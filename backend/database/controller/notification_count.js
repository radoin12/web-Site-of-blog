const db = require("../db");
const { update } = require("../model/user");






// display count notification
const getCount=(req,res)=>{
    const user=req.user.id
  
 const countQuerry= ` select * from notification_counts where userId=?`
 db.query(countQuerry,[user],(err,result)=>{
    if (err) {
       return res.status(505).send(err)         
    }
    else{
        
        return res.status(200).send(result[0])
    }
 })
}


          
    // / When a user reads a notification
     // Decrement the post_count only for the specific user
    const decrementCount=(user_id)=>{
        const decrementCountQuery = `
        UPDATE notification_counts
        SET post_count = CASE
          WHEN post_count > 0 THEN post_count - 1
          ELSE 0
        END
        WHERE userId = ?;`;
      
      db.query(decrementCountQuery, [user_id], (err, result) => {
        if (err) {
          console.log(err, 'error decrementing count');
        } else {
          console.log(result, 'decremented count');
       
        }
      });
    }
 
    const markCountToZero=()=>{
      const querry=`insert into notification_counts set post_count=0 where userId=?`
      db.query(querry,[req.user.id],(err,data)=>{
        if (err) {
          return res.json(err)
        }
        else{
          res.status(200).json('count up dated to 0')
        }
      })
    }







 const upDateCount=(io,data)=>{
     
    const querrys=`UPDATE notification_counts SET post_count = post_count + 1`
    db.query(querrys,(err,result)=>{
     if (err) {
         console.log(err)
         return ;
     }
     else{  
       
       if (data?.userId) {
        const countAssociededWithUser=`select * from notification_counts where userId=?`
        db.query(countAssociededWithUser,[data.userId],(err,count)=>{
            if (err) {
              console.log('err')  
              return ;
            }
            else{
                console.log(count[0],'count!!')
                io.emit('updateCount',count[0]);
            }
        })
       }
       
     }
    })
    
                
  
    

 }

 module.exports={upDateCount,decrementCount,getCount,markCountToZero}