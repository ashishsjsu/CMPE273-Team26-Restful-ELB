//var arguments = process.argv.splice(2);

//require the packages we need
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	crypto = require('crypto'),
	api = require('./routes/api');

var port = process.env.port || 8080; 

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


//Routes for our API
var router = express.Router();
 
 //middleware to use all requests
 //use this to do operations meant to be processed before request hits a route
router.use(function(req, res, next){

	console.log("Something is happening...");
	next();
});


router.route('/simpleproxy')
	
	 //post configuration parameters
	.post(api.addProxyConfiguration);

	
router.route('/simpleproxy/:client_id')
	//get configuration parameters
	.get(api.getProxyConfiguration)

	//update configuration parameters
	.put(api.updateProxyConfiguration)

	//delete proxy configuration
	.delete(api.deleteProxyConfiguration);


//Register our routes
//all our routes will bw prefixed with /api
app.use('/api', router);

app.listen(port);
console.log("Node http-proxy api server running on port " + port);