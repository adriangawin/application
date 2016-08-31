var helpers = require("../helpers"),
    template = "list.ejs",
    AWS = require("aws-sdk"),
    configFilePath = "config.json",
    prefix = "pawel.jablonski";

var RemoveDirectoryFromName = function(tab){
	var elements = [];
	tab.forEach(function(el){
	   if(el.Key !== prefix+'/')
	     elements.push(el);
	});

	return elements;
}

exports.action = function(request, callback) {

	AWS.config.loadFromPath(configFilePath);
	var params = {
		Bucket: 'lab4-weeia',
		Prefix: prefix
	};
	var s3 = new AWS.S3();
	s3.listObjects(params, function(err, data) {
		if(request.query.key !== null)
			var uploaded = request.query.key;
		callback(null, {template: template, params:{elements:RemoveDirectoryFromName(data.Contents), uploaded: uploaded, prefix:prefix}});
	});

}