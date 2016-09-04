var template = "login.ejs";
var helpers = require("../helpers");

exports.action = function(request,callback) {
	helpers.getCurrentDomain(function(ip){
		console.log("Detected current domain: "+ip);
		//var fields = s3Form.generateS3FormFields(ip.trim());
		callback(null, {template: template});
		
	});

}