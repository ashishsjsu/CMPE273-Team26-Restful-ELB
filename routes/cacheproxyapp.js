
var express = require('express'),
  	 app = express(),
     bodyParser = require('body-parser'),
     cacheproxyapi = require('./routes/cacheproxyapi');
     //loadbalancerapi = require('./routes/loadbalancerapi'),
     //ChangeResponse = require("./routes/ChangeResponse"),
 	 //gzip = require('./routes/gzip'),
 	//HTTP = require('./routes/httpTohttps');
 
//get mongodb connection instance
//var mongoconn = require("./routes/mongoconnectionbuilder");
//mongoconn.createMongoConnection();


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




//app middleware
router.use(function(req, res, next){
	console.log("Proxyserver middleware...");
	next();
});


router.route('/start')
      .post(cacheproxyapi.startcaching)

router.route('/stop/:configid')
      .delete(cacheproxyapi.stopcaching)


app.use('/cacheproxyserver',router)	
app.listen(8006);