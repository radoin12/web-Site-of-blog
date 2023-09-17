

const db = require("../db.js");



const Posts=function(post){
    this.img=post.img;
    this.title=post.title ;
    this.description=post.description ;
    this.userId=post.userId;
    this.cat=post.cat;
    this.date=new Date()
  
};

Posts.create=(newPost,result)=>{
   db.query("INSERT INTO posts SET ?",newPost,(err,res)=>{
     if (err) {
        result(err,null)
        return ;
     }
     result(null, { id: res.insertId, ...newPost });
   }) 
}

// find All Posts
const FindAllPosts=(resultat)=>{
 
    const q="SELECT * from posts "
    db.query(q,(err,data)=>{
        if (err) {
          resultat(null,err)  
        }
        resultat(null,data)
    })
}




// update post



const UpDatePost=(id,post,result)=>{
   console.log(id,'id post')

   db.query("UPDATE posts SET cat=?,description=?,title=?,img=? WHERE id= ?",[post.cat,post.description,post.title,post.img,id],(err,rest)=>{
    if (err) {
      return  result(null,err)
    }
    return result(null,rest)
   })
}







const findByIdPost =  (id, result)=> {
    
    db.query(`Select * from posts where id= ?`,id,(err,data)=>{
    if (err) {
      result(err,null)  
    }
     result(null,data[0])
  
   } )


};

// delete post by id
const deletePostById=function(id,result){
   db.query("DELETE FROM posts WHERE id = ?", [id], function (err, res) {
      if(err) {
        console.log("error: ", err);
        result(null, err);
      }
      else{
        result(null, res);
      }
      });
}
// get All Post With Join
const DisplayPostUser=(id,result)=>{

  db.query('SELECT `name`,`description`,`title`,`img`,`date`,`image`,`cat` FROM users u JOIN posts p on u.id=p.userId WHERE p.id=?',[id],(err,data)=>{
   if (err) {
    console.log('err',err)
     result(null,err)   
   }
   else{
    if (data.length>0) {
      result(null,data)
    }
    else{
      const querryPost=`select * from posts where id=?`
      db.query(querryPost,[id],(err,post)=>{
        if (err) {
          result(null,err)
        }
        else{
          result(null,post)
        }
      })
    }
   }
  
  })
}

// get All Posts With Join
const DisplayPostsUsers=(result)=>{
  db.query('SELECT u.name, u.image,p.id, p.title,p.description, p.img, p.date, p.img, p.cat FROM users u inner JOIN posts p ON u.id = p.userId ',(err,data)=>{
   if (err) {
    console.log(err)
     result(err,null)   
   }
  
    result(null,data)
   
   

  })
}

// get post depond of categorie
const getPostWithPreferenceCategorie=(id,result)=>{
   const q=id?"SELECT * FROM posts WHERE cat=?":"SELECT * FROM posts"
   db.query(q,id,(err,data)=>{
      if (err) {
      result(null,err)
      }
      result(null,data)
   })
}

module.exports={UpDatePost,findByIdPost,Posts,DisplayPostsUsers,FindAllPosts,deletePostById,DisplayPostUser,getPostWithPreferenceCategorie}



