'use strict'
var AWS = require('aws-sdk');

exports.handler = (event, context, callback) => {
    var dynamodb = new AWS.DynamoDB({apiVersion: '2012-08-10'});
    var d = new Date();
    var timestamp = d.getTime();
    var dd = d.getDate();
    var mm = d.getMonth() + 1; //Jan is 0!
    var yyyy = d.getFullYear();
    var response;

    if(dd<10){
        dd = '0' + dd;
    }

    if(mm<10){
        mm = '0' + mm;
    }

    var key = mm + '-' + dd + '-' + yyyy;
    //var epoch = new Date(yyyy + '-' + mm + '-' + dd).getTime();
    //var epoch = timestamp - 26000;//for 10 records (sent item/2 seconds from pi)
    var epoch = timestamp - 86000;//for 10 records (sent item/.... seconds from pi)
    console.log(epoch);
    console.log(timestamp);
    var params = {
        TableName : "tempHumiTable",
        KeyConditionExpression: "#date = :date and #time between :stamp1 and :stamp2",
        ExpressionAttributeNames:{
            "#date": "date",
            "#time": "timestamp"
        },
        ExpressionAttributeValues: {
            ":date": {"S": key},
            ":stamp1": {"N":"" + epoch},
            ":stamp2": {"N":"" + timestamp}
        },
        ProjectionExpression:"#date, #time, payload",
    };

     dynamodb.query(params, function(err, data) {
       if (err){
           console.log(err, err.stack); // an error occurred
       }else{
            console.log(JSON.stringify(data));           // successful response

            response = {
                statusCode: 200,
                //headers: {"Access-Control-Allow-Origin": "*"},
                body: JSON.stringify({data})
            };
            callback(null, response);
       }
    });
};
