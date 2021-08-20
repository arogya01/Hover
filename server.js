const express=require('express');
const app= express();
const server=require('http').Server(app);
const io=require('socket.io')(server);
const {ExpressPeerServer} = require('peer');

const peerServer = ExpressPeerServer(server,{
  debug:true
});

const {v4:uuidv4 } = require('uuid');


app.set('view engine','ejs');
app.use(express.static('public'));

app.get('/',(req,res)=>{
    res.redirect(`/${uuidv4()}`); 
})

app.get('/:room',(req,res)=>{
  res.render('room', {roomId: req.params.room})
});


server.listen(3030,(req,res)=>{
    console.log('connected to port 3030');
});

io.on('connection',socket =>{
  socket.on('join-room',(roomId,userId)=>{
   socket.join(roomId);
   socket.to(roomId).emit('user-connected',userId);
   
   socket.on('message',message=>{
     
     io.to(roomId).emit('createMessage',message);
   })
  }) 
})