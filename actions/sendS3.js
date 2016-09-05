var helpers = require("../helpers"),
    template = "sendS3.ejs",
    AWS = require("aws-sdk"),
    configFilePath = "config.json",
    prefix = "files",
    QueueUrl = "https://sqs.us-west-2.amazonaws.com/607083138257/adriangawin",
    Queue = require("queuemanager");

exports.action = function(request, callback) {

	AWS.config.loadFromPath(configFilePath);
	var keys = request.query.keys;

	
	keys = Array.isArray(keys)?keys:[keys];
		
	keys.forEach(function(key){
			
		var queue = new Queue(new AWS.SQS(), QueueUrl);
		queue.sendMessage(key, function(err, data){
			if ( err ) {
				callback(null, {template: template, params:{sqs: false, simpleDB:false, keys:key, prefix:prefix}});
			}
			else {
				var sdb = new AWS.SimpleDB();
				var dbParams = {
				    Attributes: 
			            [{
				       Name: key,
				       Value: 'no',
				       Replace: true
				    }],
				    DomainName: 'Adrian', 
				    ItemName: 'ITEM001'
				};

				sdb.putAttributes(dbParams, function(err, data) {
				if ( err ) {
					callback(null, {template: template, params:{sqs:true, simpleDB:false, keys:key, prefix:prefix}});
				}
				else {
					console.log("Wysłano plik: " + key.replace(prefix+"/", ""));
					callback(null, {template: template, params:{sqs:true, simpleDB:true, keys:key, prefix:prefix}});}
				});
			}
		});
	});
}
