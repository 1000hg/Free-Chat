let room = ['room1', 'room2', 'room3'];
let a = 0;

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log('포트 %d', port);
});

app.use(express.static(path.join(__dirname, 'test')));


io.on('connection',(socket) => {

  console.log("유저가 들어왔다.")

  // 요거 추가
  socket.on('joinRoom', (num, name) => {
    socket.join(room[num], () => {
      io.to(room[num]).emit('joinRoom', num, name);
    });
  });

  // 요거 추가
  socket.on('leaveRoom', (num, name) => {
    socket.leave(room[num], () => {
      io.to(room[num]).emit('leaveRoom', num, name);
    });
  });

  socket.on('disconnect', () => {
    console.log('유저가 나갔다.');
  });

  socket.on('chat-msg', (num, name, msg) => {
    a = num;
    io.to(room[a]).emit('chat-msg', name, msg); 
  });

});