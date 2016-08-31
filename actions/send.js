var helpers = require("../helpers"),
    template = "send.ejs",
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
			
	//console.log(key);
	var queue = new Queue(new AWS.SQS(), QueueUrl);
	queue.sendMessage(key, function(err, data){
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
		if (err)
			callback(null, {template: template, params:{send:true, log:false, keys:keys, prefix:prefix}});
		else{
		console.log("Wysłano plik: " + key.replace(prefix+"/", ""));
		callback(null, {template: template, params:{send:true, log:true, keys:keys, prefix:prefix}});}
		});

	});
});
}
