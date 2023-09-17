

const express=require('express')
const { verifyAuth } = require('../../utils/jsonWebToken')

const { getCount, markCountToZero } = require('../controller/notification_count')
const router=express.Router()


router.get('/api/notification/count',verifyAuth,getCount)
router.put('/api/count/update',verifyAuth,markCountToZero)
module.exports=router