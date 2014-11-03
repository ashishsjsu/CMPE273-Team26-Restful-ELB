var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy');
var http = require('http');
var crypto = require('crypto');
var express = require('express');
var app = express();
var	bodyParser = require('body-parser');


var router = express.Router();
var target;
var targeturl;
var latency;
var Request;
var Response;


app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/proxyserver', router);

router.use(function(req, res, next){
	console.log("Proxyserver middleware...");
	next();
});


var ProxyConfig = require("./routes/models/ProxyConfigModel");
var mongoose = require("mongoose");
var dbURI = "mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi";
mongoose.connect(dbURI);


	// CONNECTION EVENTS
	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + dbURI);
	});
	 
	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
	});
	 
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});


router.route('/createproxy')

	.post(function(req, res){

		res.end("creating proxy server");
		console.log(req.body.url);
		targeturl  = req.body.url;
		latency = req.body.latency;
		createProxyServer();
	});


router.route('/createproxy/:client_id')
	
	.get(function(req, res){
		
		var proxy = httpProxy.createProxy();
		res.end("creating proxy server");

		ProxyConfig.find({"client": req.params.client_id}, function(err, dbobj){
			if(err)
				console.log(err)
			console.log("Received data...")
			targeturl = dbobj[0].url;
			console.log(array);
			latency = dbobj[0].latency;
			createProxyServer();
		})

	})

	.put(function(req, res){

		console.log("PUTTTT "+req.body.url);
		targeturl = req.body.url;
		latency = req.body.latency;
	});



app.listen(8006);
console.log("Listening on 8006");


var proxy = httpProxy.createProxy();

function createProxyServer(){

	http.createServer(function (req, res) {

		if(req.url === '/favicon.ico')
		{
			console.log("favicon disabled");
			res.end();
			return;
		}

		console.log(targeturl);
		target = {target : targeturl} 

		if(latency > 0)
		{
			latentProxy();
		}
		else
		{
    	 	console.log('forwarding request to: ', target.target);
			proxy.web(req, res, target);
	
		}
	}).listen(8005);
}


function latentProxy(req, res){
	setTimeout(function()
			{
				console.log('forwarding request with latency: ', target.target);
				proxy.web(req, res, target);
			}, latency);
}

