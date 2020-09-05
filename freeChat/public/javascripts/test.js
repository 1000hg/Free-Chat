var socket = io()

var name;

var messages = document.getElementsByClassName('messages')[0];


$('form').submit(function (e) {
	e.preventDefault();
	
	var chatInfo = {
		name : name,
		message : $('#message').val()
	}
	
	//socket.emit('sendMessage', chatInfo);
	sendMessage(chatInfo);

	return false;
});


socket.on("connect", function () {
	name = prompt('이름을 입력해주세요.')

	if (!name) {
		name = '익명'
	}
	socket.emit('addUser', name)
	if (!location.search) {
		makeRoom()
	} else {
		join()
	}
})

socket.on('receiveMessage', (data) => {
	receiveMessage(data);
});


socket.on('update',function(data){
	sendInfo(data.name);
	sendInfo(data.userCount);
})

const sendInfo = (message) => {
	var element = document.createElement("li")
	element.className = 'info';
	element.innerHTML = message;


	addMessage(element);
}


const receiveMessage = (data) => {
	var nameSpan = document.createElement("span");
	nameSpan.className = 'username';
	nameSpan.innerHTML = data.name;
	
	var messageSpan = document.createElement("span");
	messageSpan.className = 'messageBody';
	messageSpan.innerHTML = data.message;
	
	var receiveMessage = document.createElement("li")
	receiveMessage.className = 'receive message';
	
	receiveMessage.appendChild(nameSpan);
	receiveMessage.appendChild(messageSpan);
	
	addMessage(receiveMessage);
	
	$('.chatPage').scrollTop($('.chatPage')[0].scrollHeight+20);
}

const sendMessage = (data) => {
	
	/*var nameSpan = document.createElement("span");
	nameSpan.className = 'username';
	nameSpan.innerHTML = data.username;*/
	
	var messageSpan = document.createElement("span");
	messageSpan.className = 'messageBody';
	messageSpan.innerHTML = data.message;
	
	var sendMessage = document.createElement("li")
	sendMessage.className = 'send message';
	
	//sendMessage.appendChild(nameSpan);
	sendMessage.appendChild(messageSpan);
	
	addMessage(sendMessage);
	socket.emit('sendMessage', data);
	
	$('#message').val('');
	
	$('.chatPage').scrollTop($('.chatPage')[0].scrollHeight+20);
}


const addMessage = (element) => {
	console.log(element);
	messages.appendChild(element);
}



function makeRoom() {
	var roomName;
	while (!roomName) {
		roomName = prompt("Room name")
	}
	socket.emit("room", {
		roomName: roomName
	})
}

function join() {
	socket.emit('join', location.search.split('=')[1])
}
