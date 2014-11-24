var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var simpleproxy = new Schema({configid: String, targeturl: String, proxyurl: String, latency: String, https:Boolean, status: Boolean});

var loadbalance = new Schema({configid: String, targeturl: [], proxyurl: String, latency: String})

var ProxyConfig = new Schema({ClientId: String , Simpleproxy: [simpleproxy], Loadbalance: [loadbalance]});

module.exports = mongoose.model("ProxyDB", ProxyConfig)