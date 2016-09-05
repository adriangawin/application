var AWS = require("aws-sdk");
var os = require("os");
fs = require('fs');
configFilePath = "./config.json";
template = "check.ejs";
prefix = "files";
var helpers = require("../helpers");

exports.action =  function(request, callback){
	
	AWS.config.loadFromPath('./config.json');
	var file = request.query.file;


	var paramsXXXX = {
		DomainName: 'Adrian',
		ItemName: 'ITEM001', 
		AttributeNames: [
			file,
		],
	};
	var simpledb = new AWS.SimpleDB();
	simpledb.getAttributes(paramsXXXX, function(err, data) {
		if (err) {
			console.log(err, err.stack); 
		}
		else {		
			if(data.Attributes[0].Value == "yes"){
				console.log("Przetworzono: " + data.Attributes[0].Value);				
				callback(null, {template: template, params:{status:true, file:file, prefix:prefix}});
			}else{
				console.log("Przetworzono: " + data.Attributes[0].Value);
				callback(null, {template: template, params:{status:false, file:file, prefix:prefix}});
			}
			
		}
	});	
}

