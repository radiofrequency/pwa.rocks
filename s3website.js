
var path = require("path");
var fs = require('fs');

var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

var mime = require('mime');
// Create S3 service object
s3 = new AWS.S3({apiVersion: '2006-03-01'});

//accceskey AKIATFCVFYG3QCUGWIWI
//secret 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
// Create JSON for putBucketWebsite parameters
/*var staticHostParams = {
  Bucket: '',
  WebsiteConfiguration: {
    ErrorDocument: {
      Key: ''
    },
    IndexDocument: {
      Suffix: ''
    },
  }
};

// Insert specified bucket name and index and error documents into params JSON
// from command line arguments
staticHostParams.Bucket = process.argv[2];
staticHostParams.WebsiteConfiguration.IndexDocument.Suffix = process.argv[3];
staticHostParams.WebsiteConfiguration.ErrorDocument.Key = process.argv[4];

// set the new website configuration on the selected bucket
s3.putBucketWebsite(staticHostParams, function(err, data) {
  if (err) {
    // display error message
    console.log("Error", err);
  } else {
    // update the displayed website configuration for the selected bucket
    console.log("Success", data);
  }
});*/

// snippet-end:[s3.JavaScript.website.putBucketWebsite]


const uploadDir = function(s3Path, bucketName) {

    let s3 = new AWS.S3();

    function walkSync(currentDirPath, callback) {
        fs.readdirSync(currentDirPath).forEach(function (name) {
            var filePath = path.join(currentDirPath, name);
            var stat = fs.statSync(filePath);
            if (stat.isFile()) {
                callback(filePath, stat);
            } else if (stat.isDirectory()) {
                walkSync(filePath, callback);
            }
        });
    }

    walkSync(s3Path, function(filePath, stat) {


        console.log(mime.getType(filePath));
        let bucketPath = filePath.substring(s3Path.length+1);
        let params = {StorageClass: 'REDUCED_REDUNDANCY',

        ACL: 'public-read',ContentType: mime.getType(filePath), Bucket: bucketName, Key: bucketPath, Body: fs.readFileSync(filePath) };
        s3.putObject(params, function(err, data) {
            if (err) {
                console.log(err)
            } else {
                console.log('Successfully uploaded '+ bucketPath +' to ' + bucketName);
            }
        })

    });
};

uploadDir(path.resolve("dest"), "pamprocks");

