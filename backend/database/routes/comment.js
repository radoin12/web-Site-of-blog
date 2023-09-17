const express=require('express')
const { verifyAuth, UserOrAdmin, accessDeleteComment } = require('../../utils/jsonWebToken')
const { createComment, displayComment, DELETECOMMENT } = require('../controller/comment')


const router=express.Router()

router.post('/api/addComment/:id',verifyAuth,createComment)
router.get('/api/comments/:id',displayComment)
router.delete('/api/deletecomment/:idPost',verifyAuth,accessDeleteComment,DELETECOMMENT)



module.exports=router