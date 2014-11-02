var crypto = require('crypto');

//connect to database
var ProxyConfig = require("./models/ProxyConfigModel");
var mongoose = require("mongoose");
mongoose.connect("mongodb://ashishsjsu:ashishsjsu@novus.modulusmongo.net:27017/iQeg2igi");

exports.addProxyConfiguration = function(req, res){
		
		var proxydb = new ProxyConfig;
		var targetserver = req.body.targetserver;
		var client = req.body.clientname;
		
		//proxydb.url = targetserver;
		proxydb.url.push(targetserver);
		proxydb.client = client;
		proxydb.latency = req.body.latency;

		var string = req.body.targetserver + req.body.latency;
		console.log(string)
		var hashed = crypto.createHash('md5').update(string, 'utf8').digest('hex')
		//console.log(hashed);
		proxydb.hash = hashed;

		proxydb.save(function(err){
			if(err) throw err;

		res.json({ message : "Target added"})			
	    });
		console.log(targetserver)
		
}

exports.getProxyConfiguration = function(req, res){

		ProxyConfig.findOne({"client": req.params.client_id},function(err, url){
			if(err)
				res.send(err);

			res.json(url);
		});
}

exports.updateProxyConfiguration = function(req, res){
		ProxyConfig.findOne({"client": req.params.client_id}, function(err, proxydb){

			if(err)
				res.send(err)
			//proxydb.url = req.body.targetserver;
			proxydb.url.push(req.body.targetserver);
			proxydb.latency = req.body.latency;

			var string = req.body.targetserver + req.body.latency;
			var hashed = crypto.createHash('md5').update(string, 'utf8').digest('hex')

			proxydb.hash = hashed;
		
			proxydb.save(function(err){
				if(err)
					res.send(err)

				res.json({message : "Url changed"})
			});
		});
}

exports.deleteProxyConfiguration = function(req, res){
		
		ProxyConfig.remove({"client": req.params.client_id}, function(err, proxyobj){
			if(err)
				res.send(err);

				res.json("Configuration removed successfully");
			});
			
}