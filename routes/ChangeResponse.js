var http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy');

//
// Basic Connect App
//
exports.createResponse=function(req,res1) {
	console.log("in change")
	var url = req.body.url; 
	res = connect.createServer(
		//var url = req.body.url;
  function (req, res, next) {
    var _write = res.write;

    res.write = function (data) {
      _write.call(res, data.toString().replace("World Wide Web Consortium (W3C)", "Changes"));
    }
    next();
  },
  function (req, res) {
    proxy.web(req, res);
  }
  
).listen(8013);

//
// Basic Http Proxy Server
//
var proxy = httpProxy.createProxyServer({
 // target: 'http://localhost:9013'
	target: url
	});

//
// Target Http Server
//
/*http.createServer(function (req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello, I know Ruby\n');
}).listen(9013);*/
//res.setHeader('X-HTTP-Processing-Time',RS);
res1.json({msg:"change running on: " + 8013});
res1.end();
}

/*http.createServer(function (req, res) {
	  res.writeHead(200, { 'Content-Type': 'text/plain' });
	  res.end('Hello, I know Ruby\n');
	}).listen(9013);*/
//util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8013'.yellow);
//util.puts('http server '.blue + 'started '.green.bold + 'on port '.blue + '9013 '.yellow);


