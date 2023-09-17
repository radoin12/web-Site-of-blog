



const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const {upDateCount}=require('./database/controller/notification_count.js')
const app = express();
const server =http.createServer(app)
const {AddNewNotification,newNotificationBlog,newNoticationUser}=require('./database/controller/notification.js')

 const bodyParser = require('body-parser');
 const routePost = require('./database/routes/post.js')
 const routeUser = require('./database/routes/user.js')
 const routeAuth = require('./database/routes/auth.js')
 const routeComment=require('./database/routes/comment.js')
 const routerNotification=require('./database/routes/notificatin.js')
 const routerCount=require('./database/routes/count.js')
 var cookieParser = require('cookie-parser')



 app.use(express.json())
 app.use(bodyParser.json())
 app.use(express.urlencoded({ extended: true }));
 app.use(cookieParser())

 require('dotenv').config();

const multer  = require('multer');
const db = require('./database/db.js');


// //   // storage for template used by angular
   const StorageAngular=multer.diskStorage({
     destination:function (req,file,cb) {
         cb(null,'../anotherapp/src/assets/uploads')
     },
     filename:function (req,file,cb) {
       cb(null,Date.now()+file.originalname)
     }
   })
   const upload1 = multer({ storage: StorageAngular
  
   })
   app.post('/api/uploadimg',upload1.single('file'),function(req,res) {
     const file=req.file
       console.log(file.filename ,"file")
         return res.status(200).send(file) 
      
    
  
   })

 app.use(routeComment)
 app.use(routePost)
 app.use(routeAuth)
 app.use(routeUser)
 app.use(routerNotification)
 app.use(routerCount)


// Configure CORS for regular HTTP requests


const io = socketIo(server, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ["GET", "POST", "DELETE","PUT"],
    credentials: true
    
  },
});
app.use(cors({
  origin: 'http://localhost:4200',
}));

io.on('connection', (socket) => {
  console.log('A user connected');


  socket.on('commentEvent',(data)=>{


 
    upDateCount(io,data)
  
    AddNewNotification(io,data)
  

  
  
 });

 socket.on('eventUser',(adduser)=>{
  
  newNoticationUser(io,adduser)
  upDateCount(io,adduser)


 });
 socket.on('message',(count)=>{
  
 })

 socket.on('eventBlog',(blog)=>{
  
      console.log(blog,'blog ')
  newNotificationBlog(io,blog)
  upDateCount(io,blog)


 })
    

 socket.on('disconnect', () => {
  console.log('A user disconnected');
  // Handle the socket disconnection
});

  });
  

server.listen(process.env.port, () => {
  console.log(`Server is listening on port ${process.env.port}`);
});



























