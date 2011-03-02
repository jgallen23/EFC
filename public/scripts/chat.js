jQuery(function() {
	var addMessageNode = function(message) {
		var messageNode = $('<li class="Message"><a href="" class="Avatar"><img src="http://dummyimage.com/64x64/000/fff.jpg" /><span class="name">user 1</span></a><p>'+message+'</p>');
		$(".Conversation").append(messageNode);
	};
	var room = "default";
	var socket = new io.Socket(location.hostname);
	socket.connect();
	socket.on("connect", function() {
		console.log("connect");
		socket.send('{ "type": "join", "room": "'+room+'" }');
	});

	socket.on("message", function(message) {
		var data = JSON.parse(message);
		addMessageNode(data.message);
		console.log("server message "+message);
	});

	socket.on("disconnect", function() {
		console.log("disconnect");
	});

	$("form").bind("submit", function() {
		var message = $("input:text").val();
		socket.send('{ "type": "chat", "room": "' + room + '", "message": "' + message + '"}');
		$("input:text").val('');
		addMessageNode(message);
		return false;
	});
});
