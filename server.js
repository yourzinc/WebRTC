const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid');
 
const fs = require('fs');
const https = require('https');
const server = https.createServer(
  {
    key: fs.readFileSync('./public/private.pem'),
    cert: fs.readFileSync('./public/public.pem'),
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);
 
const io = require('socket.io')(server);
 
var url = new Array();
var i =0;

app.set('view engine', 'ejs')
app.use(express.static('public'))
 
app.get('/', (req, res) => {
    res.render('enter')
    //res.redirect(`/${uuidV4()}`) // `` VS ''
                                 // Random uuid(Room Number)
                                 // for every single time to go to homepage
})
 
app.get('/makeRoom',(req,res)=>{
    
    url[i]=uuidV4()
    res.redirect(`/${url[i]}`) 
    i+=1;
})

app.get('/enterRecentRoom',(req,res)=>{
    res.redirect(`/${url[i-1]}`)
})

app.get('/:room', (req, res) => {
    res.render('room', { roomId : req.params.room })
})
 
/*
listen to someone can next come our room
    inside this pass the room id and userId
    whenever someone pass in the room we pass the roomId, userId
*/
io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        // telling all of the other users in the same room that we have joined
        // console.log(roomId, userId)
        socket.join(roomId)
 
        // socket.to(roomId) - send the msg to currently room
        // socekt.to(roomId).broadcast - send it everyone else in the room but don't send back to me
       socket.to(roomId).emit('user-connected', userId)
        //socket.to(roomId).broadcast.emit('user-connected', userId)
 
        socket.on('disconnect', () => {
        socket.to(roomId).emit('user-disconnected', userId)
    })
    })
})
 
app.get('/:room')
server.listen(3000)