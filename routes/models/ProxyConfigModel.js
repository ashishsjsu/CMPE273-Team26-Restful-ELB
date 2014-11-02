var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ProxyConfig = new Schema({url : [], client : String, latency: String, hash: String});

module.exports = mongoose.model("ProxyDB", ProxyConfig) 