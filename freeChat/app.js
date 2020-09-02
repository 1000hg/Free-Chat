var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var port = 3001;

var server = app.listen(port, () => {
	console.log(`listening at http://localhost:${port}`)
})
var io = require('socket.io')(server);


var userCount = 1;
let rooms = [];
var id = 0;

io.on('connection', (socket) => {

	console.log("connection");


	socket.on('getroom', function () {
		socket.emit('rooms', rooms.map(function (x) {
			return {
				name: x.roomName,
				uname: x.user[0].username,
				id: x.id
			}
		}))
	})


	socket.on('addUser', (username) => {
		userCount += 1;
		socket.username = username;

		//console.log(socket);

		socket.emit('checkCount', {
			userCount: userCount
		});

		socket.broadcast.emit('userJoin', {
			username: socket.username,
			userCount: userCount
		});
	});

	socket.on('room', function (data) {
		var room = {
			roomName: data.roomName,
			user: [socket],
			id: id
		}
		id += 1
		socket.room = room
		rooms.push(room)
	})

	function find(id) {
		for (let i in rooms) {
			if (id == rooms[i].id) {
				return rooms[i]
			}
		}
		return null
	}

	socket.on('join', function (data) {
		var room = find(data)
		if (room == null) return
		socket.room = room
		room.user.push(socket)
		room.user.forEach(function (x) {
			x.emit('update', {
				msg: socket.name + '님이 접속하였습니다.'
			})
		})
	})

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



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
	extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
