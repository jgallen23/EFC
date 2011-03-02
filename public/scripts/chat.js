jQuery(function() {
	var addMessageNode = function(message) {
		var messageNode = $('<li class="Message"><a href="" class="Avatar"><img src="http://dummyimage.com/64x64/000/fff.jpg" /><span class="name">user 1</span></a><p>'+message+'</p>');
		$(".Conversation").append(messageNode);
	};
	var currentRoom = "default";
	
	//SOCKET
	var socket = new io.Socket(location.hostname);
	socket.connect();
	socket.on("connect", function() {
		console.log("connect");
		joinRoom(currentRoom);
	});

	socket.on("message", function(message) {
		var data = JSON.parse(message);
		switch (data.type) {
			case "newMessage":
				addMessageNode(data.message);
				break;
			case "join":
				break;
			case "leave":
				break;
		}
		console.log("server message "+message);
	});

	socket.on("disconnect", function() {
		console.log("disconnect");
	});

	var joinRoom = function(room) {
		var data = { type: "join", room: room };
		socket.send(JSON.stringify(data));
	};

	var sendMessage = function(room, message) {
		var data = { type: "newMessage", room: room, message: message };
		socket.send(JSON.stringify(data));
		addMessageNode(message);
	};

	var leaveRoom = function(room) {
		var data = { type: "leave", room: room };
		socket.send(JSON.stringify(data));
	};

	$("form").bind("submit", function() {
		var message = $("input:text").val();
		$("input:text").val('');
		sendMessage(currentRoom, message);
		return false;
	});

	$("[data-action='create']").bind("click", function() {
		var room = prompt("What room would you like to create?");
		if (currentRoom) {
			leaveRoom(currentRoom);
		}
		joinRoom(room);
		console.log(room);
	});
});
