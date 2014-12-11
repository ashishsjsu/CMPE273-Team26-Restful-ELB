
var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	crypto = require('crypto'),
	ejs = require('ejs'),
	cacheapi = require('./routes/cacheapi');
	path = require('path');
	
var port = process.env.port || 8080; 
var routes = require('./routes/index');



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

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


//Routes for our API
var router = express.Router();
 
 //middleware to use all requests
 //use this to do operations meant to be processed before request hits a route
router.use(function(req, res, next){
	console.log("Something is happening...");
	next();
});



//app.get('/loadBalancer', test.getLoadBalancerPage);

router.route('/cacheproxy')
    .post(cacheapi.addproxyconfig)

router.route('/cacheproxy/:configid')
     .put(cacheapi.updateproxyconfig)
     .delete(cacheapi.deleteproxyconfig)

app.use('/api', router); //all our routes will bw prefixed with /api
app.use('/', routes);
//app.use('/page2');

app.listen(port);
console.log("Node http-proxy api server running on port " + port);
