const db = require("../db.js");

const { deleteUser } = require("../model/user.js");

const bcrypt=require('bcryptjs')

// find all users
const t=[]
const getAllUsers = function(req, res) {
    db.query('Select * from users',(err,employee)=>{
      if (err) {
        return res.send(err)
      }
      else{
        const emp=employee.map((item)=>{
          item.password=undefined
          return item
        })
        res.send(emp)
      }
    })

    };

    // find by id user
    const finduserById = function(req, res) {
    
        const id=req.params.id
        db.query(`Select * from users where id = ?`,[id],(err,result)=>{
          if (err) {
            res.send(err)
          }
          else{
            res.json(result[0])
          }
        })
        
    
        };
        // up date user
        const updateuser = (req, res) =>{
         
          const id=req.params.idPost
       const{name,email,image}=req.body
          const checkEmailQuery = 'SELECT id FROM users WHERE email = ? AND id != ?';

          db.query(checkEmailQuery, [email, id],
            
           (err, result)=> {
            if(err) {
          
               return res.send( err);
            }
            // If the email exists for any other user, return an error
            if (result.length > 0) {
          
             return  res.send("email is already exist")
            }
            const updateUserQuery = 'UPDATE users SET name = ?, email = ?,image = ? WHERE id = ?';
            db.query(updateUserQuery,[name,email,image,id],(err,data)=>{
               if (err) {
                console.log(err)
                return res.send(err);
               }
               const getUserQuery = 'SELECT * FROM users WHERE id = ?'; // Add a query to fetch the updated user data
              db.query(getUserQuery, [id], (err, user) => {
                if (err) {
                  console.log(err);
                  return res.send(err);
                }
                const updatedUser = user[0]; // Get the updated user data from the query result
               
                return res.send(updatedUser); // Send both the message and the updated user data
              });
             
            })
            });
      
            
             
       
          
          };
        //   delete user
        const DELETEOneUser = function(req, res) {
          deleteUser( req.params.id, (err, employee) =>{
              if (err)
              res.send(err);
              res.json({ error:false, message: 'Employee successfully deleted' });
            });
            };

    


const Getusers=(req,res)=>{
     const q=req.query.name
    
     const querrFilterUser=q?`select * from users where name LIKE ?`:`select * from users `
     const searchQuerry=q?`%${q}%`:''
    db.query(querrFilterUser,[searchQuerry],(err,result)=>{
     if (err) return res.send(err)
     const other= result.map((item)=>{
      item.password=undefined
      return item
     })
    
      res.send(other)
    
    })
 }

const DeleteAll=(req,res)=>{
  const sql="DELETE FROM users"
  db.query(sql,(err,result)=>{
    if(err)return res.send(err)
    res.send('users are deleted')
  })
}


module.exports={Getusers, getAllUsers,finduserById,updateuser,DELETEOneUser,DeleteAll }