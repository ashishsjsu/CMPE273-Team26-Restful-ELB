/**
 * New node file
 */
var ejs = require("ejs");

function getOnPage(req, res) {
	res.render('NewFile',{});
}

exports.getOnPage = getOnPage;