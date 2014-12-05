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

var proxy = httpProxy.createProxyServer({ target: url });

res1.json({msg:"change running on: " + 8013});
res1.end();
}

