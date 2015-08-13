var geo = require('./app.js')
var express = require('express');
var app = express();

app.get('/near_sites/', function (req, res) {
	//res.send('Hello World!');
	//console.log(req.query.addr);
	geo(req.query.addr, function(mylocation, near_sites){
		var reply = {
			location: mylocation, 
			near_sites: near_sites
		};
		res.setHeader('content-type', 'application/json');
		res.send(reply);
	});
});

var server = app.listen(8080);

 
