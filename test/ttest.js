let room = [];
let a = 0;
var id = 0

var express = require('express');
var app = express();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
var fs = require('fs');


server.listen(port, () => {
	console.log('포트 %d', port);
});

app.use(express.static(path.join(__dirname, 'test')));

app.get('/room', function (res, req) {
	
})



io.on('connection', (socket) => {

	console.log("유저가 들어옴");


	socket.on('getroom', function () {
		socket.emit('rooms', room.map(function (x) {
			return {
				name: x.name,
				uname: x.user[0].name,
				id: x.id
			}
		}))
	})
});
