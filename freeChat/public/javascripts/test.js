var socket = io()

var name;

socket.on("connect", function(){
    name = prompt('이름을 입력해주세요.')

    if(!name){
        name = '익명'
    }
    socket.emit('addUser', name)
    if(!location.search)
    {
		console.log("makeRoom");
        makeRoom()
    }
    else{
		console.log("join");
        join()
    }
})


function makeRoom(){
    var roomName;
    while(!roomName){
        roomName = prompt("Room name")
    }
    socket.emit("room",{roomName:roomName})
}

function join(){
    socket.emit('join', location.search.split('=')[1])
}
