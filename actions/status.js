var AWS = require("aws-sdk");
var os = require("os");
fs = require('fs');
//accessKeyId ... klucze do amazona 
configFilePath = "./config.json";
template = "status.ejs";
prefix = "pawel.jablonski";
//zawiera funkcje pomocnicze generowania skrótów robienia z jonson obiektu ...
var helpers = require("../helpers");

var task =  function(request, callback){
	
	AWS.config.loadFromPath('./config.json');
	var key = request.query.key;

	//console.log(key);	
	var paramsXXXX = {
		DomainName: 'PawelKrzysiek', //required 
		ItemName: 'ITEM001', // required 
		AttributeNames: [
			key,
		],
	};
	var simpledb = new AWS.SimpleDB();
	simpledb.getAttributes(paramsXXXX, function(err, data) {
		if (err) {
			console.log(err, err.stack); // an error occurred
		}
		else {		
			if(data.Attributes[0].Value == "yes"){
				console.log("Przetworzono: " + data.Attributes[0].Value);				
				callback(null, {template: template, params:{send:true, key:key, prefix:prefix}});
			}else{
				console.log("Przetworzono: " + data.Attributes[0].Value);
				callback(null, {template: template, params:{send:false, key:key, prefix:prefix}});
			}
			
		}
	});	
}
exports.action = task
