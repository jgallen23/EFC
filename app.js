
/**
 * Module dependencies.
 */

var express = require('express');

var app = module.exports = express.createServer();
var io = require("socket.io");

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.bodyDecoder());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.staticProvider(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'Express'
    }
  });
});


var rooms = {};

// Sockets
var socket = io.listen(app);
socket.on('connection', function(client) {

	client.on("message", function(clientJson) {
		var data = JSON.parse(clientJson);
		switch(data.type) {
			case "join":
				if (!rooms[data.room]) {
					rooms[data.room] = { 'clients': [] };
				}
				rooms[data.room].clients.push(client);
				console.log("client joined room: "+ data.room);
				break;
			case "chat":
				data.room == "default" 

				var clients = rooms[data.room].clients;
				for (var c in clients) {
					if (clients[c].sessionId != client.sessionId)
						clients[c].send(clientJson);
				}
				break;
		}
	});
	client.on("disconnect", function() {
		console.log("disconnect");
	});
});

// Only listen on $ node app.js

if (!module.parent) {
  app.listen(3000);
  console.log("Express server listening on port %d", app.address().port)
}
