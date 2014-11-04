var arguments = process.argv.splice(2);
var httpProxy = require('http-proxy'),
 	http = require('http'),
  	express = require('express'),
  	cors = require('cors'),
  	app = express(),
    bodyParser = require('body-parser');


var router = express.Router();
var target;
var targeturl;
var latency;
var Request;
var Response;
var errMsg=null;

//configure app to use CORS
app.use(cors());

//configure app to use bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

app.use('/proxyserver', router);

//app middleware
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

		targeturl  = req.body.targeturl;
		latency = req.body.latency;
		console.log("Parameters received: "+ targeturl + " " + latency);
		createProxyServer();

		res.json({msg : "Created"});
		
	});


router.route('/createproxy/:client_id')
	
	/*.get(function(req, res){
		
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

	})*/
	
	
	.put(function(req, res){

		console.log("PUTTTT "+req.body.url);
		targeturl = req.body.targeturl;
		latency = req.body.latency;

		res.json({msg : "Configuration updated"})
	})

	.delete(function(req, res){
		server.close();
		res.json({msg : "Proxy stopped"});
	});


app.listen(8006);
console.log("Listening on 8006");


var proxy = httpProxy.createProxy();

var server;

function createProxyServer(){

	server = http.createServer(function (req, res) {

		if(req.url === '/favicon.ico')
		{
			console.log("favicon disabled");
			res.end();
			return;
		}

		console.log(targeturl);
	
		//set the target for proxy
		target = {target : targeturl} 

		console.log("target: " +target);

		if(latency > 0)
		{
			setTimeout(function()
			{
				console.log('forwarding request with latency: ', target.target);
				proxy.web(req, res, target);
			}, latency);
		}
		else
		{
    	 	console.log('forwarding request to: ', target.target);
			proxy.web(req, res, target);	
		}

	}).listen(8005);

		process.on('uncaughtException', function(err){
			if(err.errno === 'EADDRINUSE')
				console.log("Port already in use");
			   errMsg = "Port already in use";
			});
}


