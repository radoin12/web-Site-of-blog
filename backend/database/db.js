const mySql=require('mysql2')

const InitiativeNotification = require('./controller/initiativeNotificationcountandstatus')
const fs=require('fs')
        


  const  db=mySql.createConnection({
    host:"localhost",
    user:"root",
    password:"radoin",
    database:"blog"
   
   
})

db.connect((err)=>{
    try {
        if (err) {
            console.log(err)
             }
//              ALTER TABLE notification 
//  ADD COLUMN is_read BOOLEAN DEFAULT false;
        //      const createTableQueryComment = `CREATE TABLE comments(
        //  id INT AUTO_INCREMENT PRIMARY KEY,
        //  content VARCHAR(255) NOT NULL,
        //  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        //  userId INT,
        //  blogId INT,
        //  FOREIGN KEY(userId) REFERENCES users(id) ON DELETE CASCADE,
        //  FOREIGN KEY(blogId) REFERENCES posts(id) ON DELETE CASCADE
        //      )`;
        //      db.query(createTableQueryComment,(err,res)=>{
        //         if (err) {
        //              console.log(err)
        //         }
        //         else{
        //             console.log(res, 'table is created')
                  
        //         }
        //         db.end(); // Close the connection after table creation
        //      })

       
            //   InitiativeNotification(db);
        // db.end()

      
         console.log("mysql is connected")   
    } catch (error) {
        console.log(error)
    }
 
})








module.exports=db ;