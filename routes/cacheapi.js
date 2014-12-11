var mongoose = require("mongoose");
mongoose.connect("mongodb://cmpe273team26:cmpe273team26@ds047800.mongolab.com:47800/proxydb");

//require the colletions
var CacheConfig = require("../models/cacheconfig");



//add default client 
exports.addproxyconfig = function(req, res){


           var cachedb= new CacheConfig();
           var count_doc = 0;		
		   console.log(cachedb)
           if(cachedb != undefined)
			{
				CacheConfig.count(function(err,count){
					console.log(count)
					count_doc=count
					count_doc++;
			      //console.log(count)
                 cachedb.configid=count_doc.toString();
                  cachedb.targeturl=req.body.targeturl
             cachedb.latency=req.body.latency

            //console.log(cachedb.targeturl)
				cachedb.save(function(err, data){
				if(err) 
					res.send(err);

				//add info to roouting table as well
				
			
			  	res.send( (err === null) ? { msg: '' } : { msg: err });
			});			
				
			})		//count++;
				
			}
		    else{
				count_doc=0
				countdoc++;
				cachedb.configid=count_doc.toString();
                  cachedb.targeturl=req.body.targeturl
             cachedb.latency=req.body.latency

            //console.log(cachedb.targeturl)
				cachedb.save(function(err, data){
				if(err) 
					res.send(err);

				//add info to roouting table as well
				
			
			  	res.send( (err === null) ? { msg: '' } : { msg: err });
			})
        }
			
        
	
}

///// make changes /////
  exports.updateproxyconfig=function(req,res){
    configid = req.params.configid
    query={"configid":configid}
    update={configid: req.params.configid, targeturl : req.body.targeturl, proxyurl: req.body.proxyurl, latency : req.body.latency}
    CacheConfig.findOneAndUpdate(query, update, function(err, data){

				res.send( (err === null) ? { msg: '' } : { msg: err });

		})
  }


  exports.deleteproxyconfig=function(req,res){
    
    configid = req.params.configid

    CacheConfig.remove({'configid' : configid}, function(err, data){
		if(err)
			throw err;

		console.log((err === null) ? { msg: 'Deleted' + data } : { msg: err });	
	})
  }

