	var http = require('http');
	var finalhandler = require('finalhandler');
	var serveStatic = require('serve-static');
	var serve = serveStatic("./");
	var msgString = 0;
	var portListen = 1579;
//------------------------------------------------------------------------//
	var server = http.createServer(function(request, response) { 
		var done = finalhandler(request, response);
		serve(request, response, done);
	});
//------------------------------------------------------------------------//
		server.listen(portListen, function() {
		console.log((new Date()) + ' Server is listening on port: ' + portListen);
	});
//------------------------------------------------------------------------//
	var WebSocketServer = require('websocket').server;
		wsServer = new WebSocketServer({
		httpServer: server
	});
//------------------------------------------------------------------------//
// when the connection is on send a Random numbers to the HTML page
	wsServer.on('request', function(r){
		var connection = r.accept('echo-protocol', r.origin);
		var count = 0;
		var clients = {};
	    // Specific id for this client & increment count
		var id = count++;
	    // Store the connection method so we can loop through & contact all clients
		clients[id] = connection;
		console.log((new Date()) + ' Connection accepted: Client ID: [' + id + '] '+" IP :" + r.remoteAddress + '.');
	   	//------------Random number generator and timer 'for' loop--------//
		var i = 0, counterUntil = 1000;
		function fRandom() {
			msgString = Math.floor(Math.random() * 1000) + 1; //produces Random number from 1 to 1000 including limits
			clients[id].sendUTF(msgString);
			i++;
			if( i < counterUntil ){
				setTimeout( fRandom, 10 );
			}
	    }
	fRandom();
//------------------------------------------------------------------------//
		connection.on('message', function(message) {}); //Do nothing since the user cannot send anything
//------------------------------------------------------------------------//
		connection.on('close', function(reasonCode, description) {
			delete clients[id];
			console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
		});

	});