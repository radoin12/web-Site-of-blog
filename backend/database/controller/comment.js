




//  create comment

const db = require("../db.js")

const createComment = (req, res) => {
    const { content } = req.body;
    const userId = req.user ? req.user.id : null;
    const blogId = req.params.id;
    const queryCreateUser = 'insert into comments set content=?, userId=?, blogId=?';
 
    db.query(queryCreateUser, [content, userId, blogId], (err, result) => {
       if (err) {
          res.status(500).json(err);
       } else {
         const getId=result.insertId
         const findcomment='select * from comments where id=?'
         db.query(findcomment,[getId],(err,addcomment)=>{
            if (err) {
                res.status(500).json(err);  
            }
            else{
                const finduser='select * from users where id=?'
                db.query(finduser,[userId],(err,user)=>{
                    if (err) {
                        res.status(500).send(err)
                    }
                    else{
                      
                       return  res.status(200).json({
                            id: addcomment[0].id,
                            blogId ,
                            user_id:user[0].id,
                            comments_content:addcomment[0].content,
                            createdAt_comment:addcomment[0].createdAt,
                            user_name:user[0].name,
                            user_image: user[0].image
                        })

                    }
                })
               
            
            }
         })
       
       
         
       }
    });
 };
// display comment 
const displayComment = (req, res) => {
    const postId=req.params.id
    const queryCommentGetComments = `
      SELECT
       c.id,
       
       c.content as comments_content ,
       c.createdAt as createdAt_comment,
       u.name as user_name ,
       u.image as user_image ,
       u.id as user_id 
       from posts as p
       INNER JOIN comments AS c ON c.blogId=p.id
       INNER JOIN users AS u ON u.id=c.userId
       WHERE p.id=?
       ORDER BY c.createdAt ASC
        `;
       
 
    db.query(queryCommentGetComments, [postId],(err, result) => {
       if (err) {
          res.status(500).json(err);
       } else {
  
          res.status(200).send(result);
       }
    });
 };
//  delete comment
const DELETECOMMENT=(req,res)=>{
    const id=req.params.idPost
    const querryDelete='DELETE FROM comments WHERE id=?'
    db.query(querryDelete,[id],(err,result)=>{
        if (err) {
          return res.status(500).send(err) 
        }
        else{
          return   res.status(200).send(id)
        }
    })
}
module.exports={createComment,displayComment,DELETECOMMENT}
