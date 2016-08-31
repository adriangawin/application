var helpers = require("../helpers"),
    template = "deleteResult.ejs",
    AWS = require("aws-sdk"),
    configFilePath = "config.json",
    prefix = "pawel.jablonski";

  

exports.action = function(request, callback) {

	AWS.config.loadFromPath(configFilePath);
	var keys = request.query.keys;
	keys = Array.isArray(keys)?keys:[keys];
	keys.forEach(function(key){
	
    var params = {
                Bucket: 'lab4-weeia',
				Key: key				            			
        };    
	console.log(key);
	var s3 = new AWS.S3();
	     
                s3.deleteObject(params, function(err, data) {
	           if (err){
				console.log(err, err.stack);
			   callback(null, {template: template, params:{del: false, keys:keys, prefix:prefix}});}
	           else{			   				   
			   callback(null, {template: template, params:{del: true, keys:keys, prefix:prefix}});}
		});
	});
}
