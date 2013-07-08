// This file implements a socket server using the socket.io package.
var http = require('http');
var bb = require('bonescript');
var fs = require('fs');
var io = require('socket.io');

var ledPin = "USR3"; // We'll be blinking USR3
var cnt = 0;
var eo = 'even';

// Create server at port 8080
var root = __dirname;
console.log('dirname: ' + __dirname);

var fdata = fs.readFileSync(root + '/ledSocket.html');

var server = http.createServer(function(req, res) {
	res.writeHead(200, {
		'Content-Type': 'html'
	});
	res.end(fdata);
}).listen(8080);

var socket = io.listen(server);

// Add connnection
socket.on('connection', function(client) {
	client.on('message', function(event) {
		console.log('Rcvd msg from client: ' + event);
	});
	client.on('disconnect', function() {
		clearInterval(interval);
		console.log('Server disconnected');
	});
	client.on('LED', function(event) {
		console.log('LED: ' + event);
		if (event == 'on') bb.digitalWrite(ledPin, bb.HIGH);
		else if (event == 'off') bb.digitalWrite(ledPin, bb.LOW);
	});
    setInterval(function() {
			console.log('cnt: ' + cnt);
			client.emit('cnt',cnt);
//            client.send({cnt: "this", eo: "eo"});
	}, 1000);
});

//Create a function that is executed every 100 ms. It takes the statReturn
//variable (which is the url requenst parameter string of the URL sent by
//the browser and determines if the LED should be on or off.
var interval = setInterval(function() {
	cnt = (cnt + 1) % 1000;
	if (cnt % 2) eo = 'odd';
	else eo = 'even';
}, 100);

