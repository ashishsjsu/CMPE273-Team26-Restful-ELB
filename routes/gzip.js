var httpProxy = require('http-proxy'),
 	http = require('http'),
 	connect = require('connect')

exports.creategzip=function(req,res){
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
				res.end();
}
	


function generatePortNumber()
{
	var proxyport = Math.floor(Math.random() * 16383) + 49152;
	return proxyport;
}