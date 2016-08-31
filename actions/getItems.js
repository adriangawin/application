var helpers = require("../helpers"),
    template = "getItems.ejs",
    AWS = require("aws-sdk"),
    domain = "PawelKrzysiek",
    configFilePath = "config.json"
    result = '';

exports.action = function(request, callback) {

AWS.config.loadFromPath(configFilePath);
var sdb = new AWS.SimpleDB();
     sdb.select({SelectExpression:"Select * from  "+ domain}, function(err, data) {
        console.log(data); 
        callback(null, {template: template, params:{elements:data.Items}});
        });
}

