var AWS = require('aws-sdk');
var s3 = new AWS.S3();

const fbFile = "feed.json"; // Name of feed file
const sourceFile = "source.json"; // Name of file to read
const bucketName = process.env.bucketName;

exports.handler = (event, context, callback) = > {
    readFile(bucketName, sourceFile, onError);
};

function readFile(bucketName, filename, onError) {
    var params = {
        Bucket: bucketName,
        Key: filename
    };
    s3.getObject(params, function(err, data) {
        if (!err) {
            const contentBody = Object.values(data.Body.toString()); // converts the content of the JSON file into an array

            /*
                    JSON File:
                    {
                        "sunday": "URL 1",
                        "monday": "URL 2",
                        "tuesday": "URL 3",
                        "wednesday": "URL 4",
                        "thursday": "URL 5",
                        "friday": "URL 6",
                        "saturday": "URL 7",
                    }
                    
                    contentBody will look like this after conversion to an array: ["URL 1", "URL 2", "URL 3", "URL 4", "URL 5", "URL 6", "URL 7"]
                    
                    */

            var today = new Date();
            var dayofWeek = today.getDay(); // returns back a number equal to the day of the week 

            var content = {
                "uid": today,
                "updateDate": today,
                "titleText": "My title here",
                "redirectionUrl": "http://my.url.com/",
                "streamUrl": contentBody[dayofWeek] // returns back the corresponding URL from the list
            };

            console.log("Feed content: " + JSON.stringify(content));

            var wParams = {
                Bucket: bucketName,
                Key: fbFile,
                Body: content
            };

            s3.putObject(wParams, function(err, data) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Successfully saved object to " + bucketName + "/" + keyName);
                }
            });

        } else {
            console.log(err);
        }
    });
}

function onError(err) {
    console.log('error: ' + err);
}
