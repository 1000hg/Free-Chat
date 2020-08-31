var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

server.listen(port, () => {
	console.log('포트 %d', port);
});

app.use(express.static(path.join(__dirname, 'public')));


var userCount = 1;


io.on('connection', (socket) => {

	console.log("connection");


	socket.on('addUser', (username) => {
		userCount += 1;
		socket.username = username;
		socket.emit('checkCount', {
			userCount: userCount
		});

		socket.broadcast.emit('userJoin', {
			username: socket.username,
			userCount: userCount
		});
	});

	socket.on('sendMessage', (data) => {
		socket.broadcast.emit('receiveMessage', {
			username: data.username,
			message: data.message
		});
	});

	socket.on('disconnect', () => {
		userCount -= 1;
		console.log("l :  " + userCount);
		console.log("leave");
	});


});
