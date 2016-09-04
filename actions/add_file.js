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
	var error = 0;
	if ( request.method == 'POST') {
		error = 1;
	}

	var config = helpers.readJSONFile(config_file);
	var policy = helpers.readJSONFile(policy_file);
	var policy2 = new Policy(policy);
	var s3Form = new S3Form(policy2);

	var bucket = policy2.getConditionValueByKey("bucket");

    var fields = s3Form.generateS3FormFields();
    fields = s3Form.addS3CredientalsFields(fields, config);

	AWS.config.loadFromPath(configFilePath);
	var params = {
		Bucket: 'bucketadrian',
		Prefix: prefix+"/"
	};
	var s3 = new AWS.S3();


    var promise = new Promise(function (resolve, reject) {
        var urlList = [];
        s3.listObjects(params, function (err, data) {
            if (err) {
                return err;
            }
            data.Contents.forEach(function (elem) {
                if (elem.Key !== prefix+'/') {
                    var params = {Bucket: 'bucketadrian', Key: elem.Key};
                    s3.getSignedUrl('getObject', params, function (err, url) {
                        var elemet = {
                            name: elem.Key,
                            url: url
                        }
                        urlList.push(elemet);
                    });
                }
            });
            resolve(urlList);
        })
    });
    promise.then(function (urlList) {
        callback(null, {
        	template: template, 
        	params: {
        		fields: fields, 
        		bucket: bucket, 
        		urlList: urlList
        	}
        });
    });




	// var urlList = [];
	// s3.listObjects(params, function(err, data) {
	// 	if(request.query.key !== null)
	// 		var uploaded = request.query.key;

 //        var urlList = [];
 //        s3.listObjects(params, function (err, data) {
 //            if (err) {
 //                return err;
 //            }
 //            data.Contents.forEach(function (elem) {
 //                if (elem.Key !== 'andrzej.prokopczyk/') {
 //                    var params = {Bucket: 'lab4-weeia', Key: elem.Key};
 //                    s3.getSignedUrl('getObject', params, function (err, url) {
 //                        var elemet = {
 //                            name: elem.Key,
 //                            url: url
 //                        }
 //                        urlList.push(elemet);
 //                    });
 //                }
 //            });
 //            resolve(urlList);
 //        })
 //    });

	// 	callback(null, {
	// 		template: template, 
	// 		params:{
	// 			elements:RemoveDirectoryFromName(data.Contents), 
	// 			//elements:data.Contents,
	// 			uploaded: uploaded, 
	// 			folder: folder,
	// 			urlList: urlList,
	// 			error: error
	// 		}
	// 	});
	// });

}
