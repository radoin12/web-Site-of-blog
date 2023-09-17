const db = require("../db.js");



const InitiativeNotification=(db)=>{
//     const initNotificationStatusQuery = `
//     INSERT INTO notification_status (user_id, notification_id)
//     SELECT u.id AS user_id, n.id AS notification_id
//     FROM users u
//     CROSS JOIN notification n
//     
//   `;
//     db.query( initNotificationStatusQuery,(err,result)=>{
//         if (err) {
//             console.log(err)
//            return ; 
//         }
//         else {
//           console.log('Users sont ajoutée orrectement au tableau status')
//         }
//     })
    const querrycount=`INSERT INTO notification_counts  (userId) 
    SELECT id from users
    `
    db.query(querrycount,(err,data)=>{
        if(err){
            console.log(err, 'err count')
        }
        else{
            console.log('les utulisateurs  sont ajoutée au table count ')
        }
    })

}

module.exports=InitiativeNotification