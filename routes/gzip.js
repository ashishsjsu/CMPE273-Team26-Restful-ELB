var httpProxy = require('http-proxy'),
 	http = require('http'),
 	connect = require('connect')
 	GzipModel = require("../models/Gzip")
 	compression = require('compression')
function creategzip(req,res){
	//var url = gzipModel.findOne
	console.log("In creategzip")
	var url =req.body.targeturl
	console.log("In creategzip url "+url)
	var port = generatePortNumber()
	console.log("In creategzip port "+port)
	gzipserver=connect.createServer(
			  //connect.compress({
			    //threshold: 1
			  //}),			
			compression(),
			  function (req, res) {
				console.log("in compression")
			    proxy.web(req, res);
			  }
			  
			);//.listen(port);	
		process.on('uncaughtException', function (err) {
    	
    	//assign a new port if previous one is already in use and update routing table
    	if(err.errno === "EADDRINUSE")
    	{
    		var port =  generatePortNumber();
    		console.log(port);
    		//proxy = httpProxy.createProxyServer({
				//  target: url
				//});
    		gzipserver.listen(port);
    		//portnumber = port;
    		//reverseproxyserver.listen(port);
    		//updateRoutingInfowithUrl(config.configid, port);
   	 	}
		});
			gzipserver.listen(port);	
			var proxy = httpProxy.createProxyServer({
				  target: url
				});
			
				//res.json({msg:"gzip running on: " + port});
				//console.log("In creategzip proxy "+proxy)
				//res.end();
				return port;
}

exports.insertInDb=function(req, res){
	//gzipModel.findOne
	var gzipModel = new GzipModel;
	var port =0
	//var Id = GzipModel.count({},function(err,count){
	console.log("targetUrl: " + req.body.targeturl)	
	//if(err)
		//throw err
	//console.log("gzip count" + count)
	//Id=count+1;
	//console.log("gzip Id" + Id)
	//gzipModel.id = parseInt(Id)
	//var gzipdb = [];
	GzipModel.find({},function(err, gzipdb){		
		//var gzipMap = {}
		var count1 = " ";	
		count1='0'
			console.log("gzipdb "+gzipdb)
		if(gzipdb!= null)
		{				
			//console.log("In simple proxy array")
			gzipdb.forEach(function(item){
			count1=item.configid;
			//console.log("string count" + count1)
			//console.log("Item" + item)
			//if(item===null)
				//{count1='0'}
			})
		}
		count=parseInt(count1);
		count++;
		console.log("count" + count)
		port = creategzip(req,res)
		console.log("In createindb "+port)
		gzipModel.configid = count;
		gzipModel.proxyurl = 'http://localhost:'+port
		gzipModel.targeturl = req.body.targeturl
		
		//port = creategzip(req,res)
		gzipModel.save(function(err){
			if(err)
				throw err;
			console.log("gzip added : " + gzipModel);
		});		
});

	//console.log("gzip outside count" + Id)
	//port = creategzip(req,res)
	//gzipModel.id = parseInt(Id)
	//res.json({msg:"gzip running on: " + port});
	res.end();
}

	
function generatePortNumber()
{
	var proxyport = Math.floor(Math.random() * 16383) + 49152;
	return proxyport;
}

function getGzip(req, res){
	GzipModel.find({}, function(err, docs){
		if(err)
			throw err;
		res.json(docs);
	});
}

exports.getGzip = getGzip;

exports.deleteGzip = function(req, res){
	var query = {};
	
	var update = { $pull  : {configid: req.params.configid}};

	deleteGzipInfo(req.params.configid);

}//deleteProxyConfiguration


//delete proxy configuration from Routing table
function deleteGzipInfo(configid){

	GzipModel.remove({'configid' : configid}, function(err, data){
		if(err)
			throw err;

		console.log((err === null) ? { msg: 'Deleted' + data } : { msg: err });	
	})
}
