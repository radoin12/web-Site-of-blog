const db = require("../db.js");
const Joi = require('joi');
const { findByIdPost, UpDatePost, Posts, FindAllPosts, deletePostById, DisplayPostUser, getPostWithPreferenceCategorie, DisplayPostsUsers} = require("../model/post.js");

const userSchema = Joi.object({
 
  title: Joi.string().required(),
  description: Joi.string().required(),
  cat: Joi.string().required(),
  img: Joi.required(),
});
function sanitizeHTML(html) {
  // Your sanitization logic here (e.g., using DOMPurify or other libraries)
  // For demonstration purposes, we'll just replace "<" and ">" characters with "&lt;" and "&gt;" to prevent script tags
  return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
const createPost=(req,res)=>{
   
    const post=new Posts({
        img:req.body.img ,
       title:req.body.title,
       description:sanitizeHTML(req.body.description),
      userId:req.user.id ,
       cat:req.body.cat
   
    })
    const { error } = userSchema.validate(req.body);

    if (error) {
      return res.send(error.details[0].message);
        }
    Posts.create(post, (err, data) => {
     
        if (err)
          return res.status(500).send({
            message:
              err.message || "Some error occurred while creating posts."
          });
        
            else res.send(data);
      });
 
}


// find All Posts
const FindPosts=(req,res)=>{
    const getUsersQuery = 'SELECT * FROM users ';
  db.query(getUsersQuery, (err, users) => {
    if (err) {
      console.error('Error fetching users:', err);
      return res.status(500).json({ error: 'Error fetching users' });
    }
    const getUsersPostsQuery = 'SELECT * FROM posts WHERE userId = ?';
    const usersWithPosts = users.map((user) => {
      return new Promise((resolve, reject) => {
        db.query(getUsersPostsQuery, [user.id], (err, posts) => {
          if (err) {
            console.error('Error fetching posts for user:', user.id, err);
            return reject({ error: 'Error fetching posts' });
          }
          user.posts = posts;
          resolve(user);
        });
      });
    })
  Promise.all(usersWithPosts)
    .then((usersData) => {

      return res.status(200).json(usersData);
    })
    .catch((error) => {
  
      return res.status(500).json({ error: 'Error fetching users and posts' });
    });
  
   
   })

}
// findOneuserWithPosts

const FindOneUsrWithPosts=(req,res)=>{
  const q="SELECT * FROM users WHERE id=?"
  db.query(q,[req.params.id],(err,user)=>{
    if (err) {
      return res.send(err)
    }
  
    const getUsersPostsQuery = 'SELECT * FROM posts WHERE userId = ?';

     

      const users=user[0]?.id&&user[0]?.id
    
      db.query(getUsersPostsQuery,[users],(err,posts)=>{
        if (err) {
         
       
          return res.send({error:'error fetchin post from user'})
        }
        else{
          
      const NewComment= posts.map((post)=>{
        return new Promise((resolve,reject)=>{
      
          db.query(`select c.*,u.image,u.name from users u inner join comments c  on c.userId=u.id where blogId=?`,[post.id],(err,data)=>{
            if (err) {
              console.log(err)
               return reject(err)
            }
            else{
              console.log(data)
              post.comment=data
                   
                resolve(post)

          

            }
          })
        })

      })
      Promise.all(NewComment)
    .then((post) => {
      const oneUserWithPosts={...user[0],post}
      return res.status(200).json( oneUserWithPosts);
    })
    .catch((error) => {
  
      return res.status(500).json({ error: 'Error fetching users and posts' });
    });
   
          
          // return  res.status(200).send(oneUserWithPosts)
      

        }
        

     
      
      })
    
   
     
   
     
     
     

  
  })
}

//   up date post
const updatePosts=(req,res) => {
   
  const { error } = userSchema.validate(req.body);

  if (error) {
    return res.send(error.details[0].message);
      }
 
   
    UpDatePost(req.params.idPost,new Posts(req.body),(error,employee)=> {
          if (error) {
            return res.status(500).send({
                message:
                  err.message || "Some error occurred while creating posts."
              });
          }
          findByIdPost(req.params.idPost, (err,data)=>{
      
            if (err) {
            return  res.send(err)  
            }
            
           return res.json(data)
            
               
            
            
            
           } ); 
     });
  };
const FindByOnePost=(req,res)=>{
    findByIdPost(req.params.id,(err,data)=>{
        if (err) {
          res.send(err)  
        }
    
        res.json(data)
    })
}
   // delete All posts
const DeleteAllPost=(req,res)=>{
    const sql="DELETE FROM posts"
    db.query(sql,(err,result)=>{
      if(err)return res.send(err)
      res.send('posts are deleted')
    })
  }
  // delete one post
  const DeletePost=(req,res)=>{
    deletePostById(req.params.idPost,(err,data)=>{
      if (err) {
        return res.json(err)
      }
      return res.send(req.params.idPost)
     
      
    })
  }
//  find AllUserWithJoin
const findPostsWithUsers=(req,res)=>{
  DisplayPostUser([req.params.id],(err,data)=>{
    if (err) {
      console.log(err)
    return  res.send(err)
    }
    console.log(data[0],'data user posts')
    res.status(200).json(data[0])
  })
}
const FindAllUsersAndPosts=(req,res)=>{
  DisplayPostsUsers((err,data)=>{
    if (err) {
      console.log(err)
      return res.send(err)
    }
    return res.status(200).json(data)
  })
}
  // get post depond of categorie
  const  PostDepondOfCat=(req,res)=>{
  const q=req.query.cat
  

  
    getPostWithPreferenceCategorie(q,(err,data)=>{
      if (err) {
       return res.status(500).send(err)
      }
      else{
       return  res.status(200).send(data)
      }
    })
  }
  // count categori post
  const countCategory=(req,res)=>{
    
    const fieldToCount = 'cat'; 

    const sql = `SELECT ${fieldToCount}, COUNT(${fieldToCount}) AS field_count FROM posts WHERE ${fieldToCount} IS NOT NULL GROUP BY ${fieldToCount}`;
    db.query(sql, (err, result) => {
      if (err) {
        return res.status(500).json({ error: 'Error fetching field values count' });
      }

      const fieldCounts = result.map((row) => ({ [row[fieldToCount]]: row.field_count }));
      res.json({fieldCounts} );
    });
   
  
  
  
  }

module.exports={createPost,updatePosts,FindByOnePost,
  DeleteAllPost,FindPosts,DeletePost,FindAllUsersAndPosts,
  findPostsWithUsers,FindOneUsrWithPosts,PostDepondOfCat,countCategory }