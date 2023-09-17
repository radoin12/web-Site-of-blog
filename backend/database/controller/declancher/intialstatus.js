const db = require("../../db");


const assosiateExistantUser=(getId)=>{
    const querry=`INSERT INTO notification_status (user_id, notification_id)
    SELECT id AS user_id, ? AS notification_id FROM users
    `

    db.query(querry,[getId],(err,result)=>{
        if (err) {
           console.log(err,'err') 
           return ;
        }
        else{
            console.log('create data succefully')
        }
    })
}

const assosierNewUser=(userId,notificationId)=>{
    console.log('im here')
    const querry=` INSERT INTO notification_status (user_id, notification_id)
    VALUES (?, ?);`
    db.query(querry,[userId,notificationId],(err,result)=>{
        if (err) {
            console.log(err, 'err')
        }
        else{
            console.log('user associated succeffully')
        }
    })
}

module.exports={assosiateExistantUser,assosierNewUser}