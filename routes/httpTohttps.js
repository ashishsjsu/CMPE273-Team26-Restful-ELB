/**
 * New node file
 */

var http = require('http'),
	https = require('https'),
	util = require('util'),
	path = require('path'),
	//colors = require('colors'),
	httpproxy = require('http-proxy'),
	connect = require('connect');


exports.forwardRequest = function(req, res){
	var url = req.body.url;
	res = httpproxy.createProxyServer({
		target : 'https://www.linkedin.com',
		agent : https.globalAgent,
		headers : {
			host : 'www.linkedin.com'
		}
	}).listen(8451);
	//res.json({msg:"Started secure proxy server"});
	//res.end();
}

//
//Create a HTTP Proxy server with a HTTPS target
//
/*httpproxy.createProxyServer({
	target : 'https://www.linkedin.com',
	agent : https.globalAgent,
	headers : {
		host : 'www.linkedin.com'
	}
}).listen(8011);
*/
//util.puts('http proxy server'.blue + ' started '.green.bold + 'on port '.blue + '8011'.yellow);
	