const express=require('express')
const { Register, Login, Logout } = require('../controller/auth')


const route=express.Router()
route.post('/api/auth/register',Register)
route.post('/api/auth/login',Login)
route.post('/api/auth/logout', Logout)

module.exports=route