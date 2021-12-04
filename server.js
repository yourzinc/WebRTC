const express = require('express');
const app = express();
const { v4: uuidV4 } = require('uuid');


/*============================================================*/
/* Connect MySQL */
const mysql = require('mysql');
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'ilovemasaki', // DB 비밀번호 입력
    database: 'express_db'
});

con.connect(function(err){
    if(err) throw err;
    console.log('Connected');

    //DB 생성 코드

    // con.query('CREATE DATABASE express_db', function(err, result){
    //     if(err) throw err;
    //     console.log('database created');
    // })

    //DB의 TABLE 생성 코드

    // const sql = 'CREATE TABLE users (userID INT NOT NULL PRIMARY KEY AUTO_INCREMENT, roomID VARCHAR(255) NOT NULL)';
    // con.query(sql, function (err, result)
    // {
    //     if(err) throw err;
    //     console.log('Table Created');
    // });

});

/*============================================================*/

const fs = require('fs');
const https = require('https');
const server = https.createServer(
  {
    key: fs.readFileSync('./private.pem'),
    cert: fs.readFileSync('./public.pem'),
    requestCert: false,
    rejectUnauthorized: false,
  },
  app
);

const io = require('socket.io')(server); 

var url = new Array(5);
var i =0;

// USER ID
// var j =0;
// var new_user_id = j;

app.set('view engine', 'ejs')
app.use(express.static('public'))
 
app.get('/', (req, res) => {

    // SELECT문 - DB에 저장된 정보 조회하기

    // const sql = "select * from users";
    // con.query(sql, function(err, result, fields) {
    //     if(err) throw err;
    //     console.log(result);
    // })

    res.render('enter',{url_info:url})
    //res.redirect(`/${uuidV4()}`) // `` VS ''
                                 // Random uuid(Room Number)
                                 // for every single time to go to homepage
})
 
app.get('/makeRoom',(req,res)=>{
    
    url[i]=uuidV4()

    // INSERT문 - NEW roomID를 DB에 저장하기

    const sql = "INSERT INTO users(roomID) VALUES(?)"

    con.query(sql, [url[i]], function(err, result, fields){
        if(err) throw err;
        console.log(result);
    })
    //

    res.redirect(`/${url[i]}`) 
    i+=1;
})

app.get('/enterRecentRoom',(req,res)=>{
    res.redirect(`/${url[i-1]}`)
})



app.get('/enterRoom_1',(req,res)=>{

    
    res.redirect(`/${url[0]}`)
})
app.get('/enterRoom_2',(req,res)=>{
    res.redirect(`/${url[1]}`)
})
app.get('/enterRoom_3',(req,res)=>{
    res.redirect(`/${url[2]}`)
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