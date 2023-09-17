const express=require('express')
const db = require('../db.js')
const { Getusers, getAllUsers, finduserById, updateuser, DELETEOneUser, DeleteAll } = require('../controller/user.js')
const { UserOrAdmin } = require('../../utils/jsonWebToken.js')



const route=express.Router()
route.get('/api/user',Getusers)
route.get('/user',getAllUsers)
route.get('/api/user/:id',finduserById)
route.put('/api/user/update/:idPost',UserOrAdmin,updateuser)
route.delete('/api/user/delete/:id',DELETEOneUser)
route.delete('/api/user/deleteAll',DeleteAll)
module.exports=route