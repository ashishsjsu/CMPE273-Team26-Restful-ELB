/**
 * New node file
 */
var ejs = require("ejs");

function getOnPage(req, res) {
	res.render('NewFile',{});
}

exports.getOnPage = getOnPage;

function getLoadBalancerPage(req, res) {
	res.render('LoadBalancer',{});
}

exports.getLoadBalancerPage = getLoadBalancerPage;

function getHttpToHttpsPage(req, res){
	res.render('HttpToHttps',{});
}

exports.getHttpToHttpsPage = getHttpToHttpsPage;


exports.getChangeResponsePage = function(req, res){
	res.render('ChangeResponse', {});
}