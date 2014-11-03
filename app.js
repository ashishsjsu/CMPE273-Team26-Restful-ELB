//var arguments = process.argv.splice(2);

//require the packages we need
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	crypto = require('crypto'),
	api = require('./routes/api');
	path = require('path');

var port = process.env.port || 8080; 

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//configure app to use bodyParser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

//Routes for our API
var router = express.Router();
 

 //middleware to use all requests
 //use this to do operations meant to be processed before request hits a route
router.use(function(req, res, next){

	console.log("Something is happening...");
	next();
});
	
router.route('/simpleproxy/:id')
	//post configuration parameters
	.post(api.addProxyConfiguration);

router.route('/simpleproxy/:id')

	//get configuration parameters
	.get(api.getProxyConfiguration)

	//update configuration parameters
	.put(api.updateProxyConfiguration)

	//delete proxy configuration
	.delete(api.deleteProxyConfiguration);

router.route('/addUser')
	//post configuration parameters
	.post(api.addUser)

router.route('/getUsers')
	.get(api.getAllUsers);


//Register our routes
//all our routes will bw prefixed with /api
app.use('/api', router);
app.use('/', routes);

app.listen(port);
console.log("Node http-proxy api server running on port " + port);
