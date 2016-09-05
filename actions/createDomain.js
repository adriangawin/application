var helpers = require("../helpers"),
    template = "createDomain.ejs",
    AWS = require("aws-sdk"),
    domain = "Adrian",
    configFilePath = "config.json"
    result = '';

exports.action = function(request, callback) {

	AWS.config.loadFromPath(configFilePath);
	var sdb = new AWS.SimpleDB();
	var paramsDB = {
  		DomainName: domain};

	var createDomain = function(){
		sdb.createDomain(paramsDB, function(err, data) {
		  if (err) console.log(err, err.stack);
		  else 
             result = "Domena o takiej nazwie została utworzona";          
		 });
	}; 
       
     	sdb.domainMetadata(paramsDB, function(err, data) {
	  if (err)  createDomain();
	  else      
	    	result = "Domena już istnieje"; 
          callback(null, {template: template, params:{name:result}});
        });
}

