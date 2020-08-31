var userName


window.onload = () => {

	var nameCheck = true;
	while (nameCheck) {
		userName = prompt('이름을 입력해주세요.');

		if (userName) {
			nameCheck = false;
			socket.emit('addUser', userName);
		}
	}
}

var messages = document.getElementsByClassName('messages')[0];
var inputMessage = document.getElementsByClassName('inputMessage')[0];

var socket = io();


socket.on('checkCount', (data) => {
	var message = "자유 채팅방에 오신 것을 환영합니다. ";
	sendInfo(message);
	addUserCountMessage(data);
});

socket.on('userJoin', (data) => {
	sendInfo(data.username + '님이 입장하셨습니다.');
	addUserCountMessage(data);
});

socket.on('receiveMessage', (data) => {
	receiveMessage(data);
});



const sendInfo = (message) => {
	var element = document.createElement("li")
	element.className = 'info';
	element.innerHTML = message;


	addMessage(element);
}

const addMessage = (element) => {
	console.log(element);
	messages.appendChild(element);
}

const addUserCountMessage = (data) => {
	var message = "현재 방 입장 인원 " + data.userCount + "명";
	sendInfo(message);
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
}

const receiveMessage = (data) => {
	var nameSpan = document.createElement("span");
	nameSpan.className = 'username';
	nameSpan.innerHTML = data.username;
	
	var messageSpan = document.createElement("span");
	messageSpan.className = 'messageBody';
	messageSpan.innerHTML = data.message;
	
	var receiveMessage = document.createElement("li")
	receiveMessage.className = 'receive message';
	
	receiveMessage.appendChild(nameSpan);
	receiveMessage.appendChild(messageSpan);
	
	addMessage(receiveMessage);
}



/*const sendMessage = () => {
	var message = inputMessage.value();
	message = cleanInput(message);
	if (message && connected) {
		$inputMessage.val('');
		addChatMessage({
			username: username,
			message: message
		});
		
		socket.emit('new message', message);
	}
}*/



inputMessage.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      var message = inputMessage.value;
		
		if(message){
			sendMessage({
				username : userName,
				message: message
			});
			
		}
		
    }
});
