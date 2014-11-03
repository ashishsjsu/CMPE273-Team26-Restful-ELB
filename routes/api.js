var crypto = require('crypto');

//connect to database
var ProxyConfig = require("./models/ProxyConfigModel");
var mongoose = require("mongoose");
mongoose.connect("mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi");

var Client = require('node-rest-client').Client;

var targetArray = [];

exports.addProxyConfiguration = function(req, res){
		
		var proxydb = new ProxyConfig;
		
		proxydb.email = "abc@example.org";
		proxydb.password = "abc";
		proxydb.clientid = "1";
		proxydb.Simpleproxy.push({ targeturl: req.body.targeturl, proxyurl: req.body.proxyurl, latency: req.body.latency});

		proxydb.save(function(err){
			if(err) 
				res.send(err);
			//res.json({ message : "Target added"});	
			  res.send( (err === null) ? { msg: '' } : { msg: err });
			console.log(req.body.targeturl);

		});		
		addProxyConfig(req.body.targeturl, req.body.latency);
}


exports.getProxyConfiguration = function(req, res){

		ProxyConfig.find({}, function(err, dbObj){
			if(err)
				res.send(err);
			
			console.log("in GET");
			res.json(dbObj);
			console.log(dbObj);

		});

}

exports.updateProxyConfiguration = function(req, res){
		ProxyConfig.findOne({"client": req.params.client_id}, function(err, proxydb){

			if(err)
				res.send(err)
			//proxydb.url = req.body.targetserver;
			proxydb.url = req.body.targetserver;
			proxydb.latency = req.body.latency;

			var string = req.body.targetserver + req.body.latency;
			var hashed = crypto.createHash('md5').update(string, 'utf8').digest('hex')

			proxydb.hash = hashed;
		
			proxydb.save(function(err){
				if(err)
					res.send(err)
				res.json({message : "Url changed"})
			});
			console.log("Calling update hidden: "+ req.body.targetserver)
			updateProxyConfig(req.body.targetserver,  req.body.latency, req.params.client_id);

		});

}

exports.deleteProxyConfiguration = function(req, res){

		var proxyToDelete = req.params.id;

		console.log("in Delete "+ req.params.id);		

		ProxyConfig.remove({"_id":req.params.id}, function(err, result){
			if(err)
				res.send(err);

        		res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
			});
}

function updateProxyConfig(URL, LATENCY, clientId){
	client = new Client();

	var args = {
			data: {url: URL, latency: LATENCY},
			headers: {"Content-Type": "application/json"}
		};

	client.put('http://localhost:8006/proxyserver/createproxy/'+clientId, args, function(data, response){
		console.log(data);
	});

}


function addProxyConfig(URL, LATENCY){

	client = new Client();
	
	var args = {
		data: { url: URL, latency: LATENCY},
		headers:{"Content-Type": "application/json"} 
	};

	console.log(args);

	client.post('http://localhost:8006/proxyserver/createproxy', args, function(data, response){
		console.log(data);
	});
}