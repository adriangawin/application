var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var template = "add_file.ejs";
var policy_file = "policy.json";
var config_file = "config.json";
var prefix = "files"
var Promise = require("promise");
var AWS = require("aws-sdk");


var RemoveDirectoryFromName = function(tab){
	var elements = [];
	tab.forEach(function(el){
	   if(el.Key !== prefix+'/')
	     elements.push(el);
	});
	return elements;
}

exports.action = function(request, callback) {

	var config = helpers.readJSONFile(config_file);
	var policy = helpers.readJSONFile(policy_file);
	var policy2 = new Policy(policy);
	var s3Form = new S3Form(policy2);

	var bucket = policy2.getConditionValueByKey("bucket");

    var fields = s3Form.generateS3FormFields();
    fields = s3Form.addS3CredientalsFields(fields, config);

	AWS.config.loadFromPath(configFilePath);

	callback(null, {template:template, params:{fields:fields,bucket:bucket}});
};
