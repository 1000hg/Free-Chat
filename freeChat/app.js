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

var mysql = require('mysql');
var connection = mysql.createConnection({
	host: 'localhost',
	port: '3308',
	user: 'root',
	password: 'pairy1@3tail',
	database: 'test1'
});


connection.connect(function (err) {
	if (err) throw err;
	console.log("DB Connected");
});


/*var sql = "INSERT INTO user (name, id, password) VALUES ('김윤수', 'a123123', 'b123123')";
connection.query(sql, function (err, result) {
  if (err) throw err;
  console.log("contents inserted");
});*/


connection.query("SELECT * FROM user", function (err, result, fields) {
	if (err) throw err;
	console.log(result);
});

connection.end();



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
		++userCount;
		socket.username = username;

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

	function findRoom(id) {
		for (let i in rooms) {
			if (id == rooms[i].id) {
				return rooms[i]
			}
		}
		return null
	}

	socket.on('join', function (data) {
		var room = findRoom(data)
		if (room == null) return
		socket.room = room
		room.user.push(socket)
		room.user.forEach(function (x) {
			x.emit('update', {
				name: socket.username + '님이 접속하였습니다.',
				userCount: userCount + '명 접속중'
			})
		})
	})

	socket.on('sendMessage', (data) => {
		socket.broadcast.emit('receiveMessage', {
			name: data.name,
			message: data.message
		});
	});

	socket.on('disconnect', () => {

		if (socket.room) {
			userCount -= 1;
			let user = socket.room.user

			if (user.length == 0) {
				rooms.pop(rooms.findIndex(function (x) {
					return x.roomName == socket.roomName
				}))
			} else {
				user.forEach(function (x) {
					x.emit('update', {
						name: socket.username + '님이 나가셨습니다.',
						userCount: userCount + '명 접속중'
					})
				})
				
				let num = user.findIndex(function (x) {
					return x.username == socket.username
				})

				user.pop(num)
			}
		}


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
