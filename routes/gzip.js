var httpProxy = require('http-proxy'),
 	http = require('http'),
 	connect = require('connect')
 	GzipModel = require("../models/Gzip")
function creategzip(req,res){
	//var url = gzipModel.findOne
	var url =req.body.url
	var port = generatePortNumber()
	gzipserver=connect.createServer(
			  connect.compress({
			    threshold: 1
			  }),
			  function (req, res) {
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
				res.json({msg:"gzip running on: " + port});
				//res.end();
				return port;
}

exports.insertInDb=function(req, res){
	//gzipModel.findOne
	var gzipModel = new GzipModel;
	var Id = GzipModel.count({},function(err,count){
		
	if(err)
		throw err
	console.log("gzip count" + count)
	Id=count+1;
	console.log("gzip Id" + Id)
	gzipModel.id = parseInt(Id)
	gzipModel.proxyurl = 'http://localhost:'+port
	gzipModel.targeturl = req.body.url
	gzipModel.save(function(err){

		if(err)
			throw err;

		console.log("gzip added : " + gzipModel);
	});
	});
	console.log("gzip outside count" + Id)
	port = creategzip(req,res)
	//gzipModel.id = parseInt(Id)
	
	res.end();
}

/*function getId()
{
	var count = 0;			
	if(gzipModel != undefined)
	{
		gzipModel.forEach(function(item){
			count++;
		})
	}
	count++;
	return count;
}*/
	
function generatePortNumber()
{
	var proxyport = Math.floor(Math.random() * 16383) + 49152;
	return proxyport;
}

function getGzip(req, res){
	console.log("in gzip");
	res.render('gzip',{});
	
}

exports.getGzip = getGzip;
