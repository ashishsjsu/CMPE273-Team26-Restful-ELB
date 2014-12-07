/* Express app (routes only) to create and manage simple reverse proxy server with options for latency and HTTP -> HTTPS proxy and load balancer*/

var arguments = process.argv.splice(2);

 var express = require('express'),
  	 app = express(),
     bodyParser = require('body-parser'),
     proxyapi = require('./routes/proxyserverapi'),
     loadbalancerapi = require('./routes/loadbalancerapi'),
     ChangeResponse = require("./routes/ChangeResponse"),
 	 gzip = require('./routes/gzip'),
 	HTTP = require('./routes/httpTohttps');
 
//get mongodb connection instance
var mongoconn = require("./routes/mongoconnectionbuilder");
mongoconn.createMongoConnection();


var router = express.Router();

//configure app to use bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//configure app for cross-origin requests
app.all('*', function(req, res, next){

	console.log("In app all");
	if (!req.get('Origin')) return next();
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type');
	if ('OPTIONS' == req.method) return res.sendStatus(200);
	next();
});


app.use('/proxyserver', router);

//app middleware
router.use(function(req, res, next){
	console.log("Proxyserver middleware...");
	next();
});

app.listen(8006);

//route to create a simpleproxy server as per requested configurations
router.route("/reverseproxy")

	.post(proxyapi.createReverseProxyServer);

router.route("/reverseproxy/:configid")
	
	.delete(proxyapi.stopReverseProxyServer);
	
//temporary function to insert routing info in routing table
router.route("/routinginfo")
	
	.post(proxyapi.addRoutingInfo);

router.route("/routinginfo/:configid")
	
	.put(proxyapi.updateRoutingInfo);

router.route("/gzip")

	.post(gzip.creategzip);

//routes for loadbalacer api here
router.route("/loadbalancer")

	.post(loadbalancerapi.createLoadBalancer);

router.route("/loadbalancer/:configid")
	
	.delete(loadbalancerapi.stopLoadBalancer);

//route to remove an instance from load balancer
router.route('/loadbalancer/:configid/appinstance')
	.delete(loadbalancerapi.removeFromloadBalancer);

router.route("/ChangeResponse")
.post(ChangeResponse.createResponse);


//routes for loadbalacer api here
router.route("/secure")

	.get(HTTP.forwardRequestSecure);