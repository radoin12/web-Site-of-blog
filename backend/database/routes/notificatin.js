

const express=require('express')
const { verifyAuth } = require('../../utils/jsonWebToken')

const { getNotificationStatusJoinNotification, markNotificationAsReadble, markNotificationAsDelete } = require('../controller/notification_status')
const router=express.Router()


router.get('/api/notification',verifyAuth,getNotificationStatusJoinNotification)
router.put('/api/notification/read/:id',verifyAuth,markNotificationAsReadble)
router.delete('/api/notification/delete/:id',verifyAuth,markNotificationAsDelete)
module.exports=router