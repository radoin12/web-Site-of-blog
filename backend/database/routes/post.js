const express=require('express')
const { verifyAuth, AdminOrUser } = require('../../utils/jsonWebToken.js')
const { createPost, updatePosts, FindByOnePost, DeleteAllPost, FindPosts, DeletePost, findPostsWithUsers, FindOneUsrWithPosts, PostDepondOfCat, countCategory, FindAllUsersAndPosts } = require('../controller/post.js')

  

const route=express.Router()

route.post('/api/post',verifyAuth)
route.post('/api/post',verifyAuth,createPost)
route.put('/api/posts/update/:idPost',verifyAuth,AdminOrUser,updatePosts)
route.get('/api/post/:id',FindByOnePost)
route.get('/api/post',FindPosts)
route.get('/api/posts/users/:id',findPostsWithUsers)
route.delete('/api/post',DeleteAllPost)
route.delete('/api/post/delete/:idPost',verifyAuth,AdminOrUser,DeletePost)
route.get('/api/user/post/:id',FindOneUsrWithPosts)
route.get('/api/all',PostDepondOfCat)
route.get('/api/count',countCategory)
route.get('/api/usersJoinPost',FindAllUsersAndPosts)
module.exports=route