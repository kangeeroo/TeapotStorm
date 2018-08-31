var awsIoT = require('aws-iot-device-sdk');
var rpio = require('rpio');
var PythonShell = require('python-shell');
var sleep = require('sleep');

var pythonScriptPath = '../../Adafruit_Python_DHT/Adafruit_DHT/data.py';
var media;
var timestamp;

rpio.open(12, rpio.OUTPUT, rpio.LOW);

//var pyshell = new PythonShell(pythonScriptPath);
var pyshell = new PythonShell('data.py',{
  scriptPath:"../../Adafruit_Python_DHT/Adafruit_DHT/", pythonOptions: ['-u']
});

var device = awsIoT.device({
    keyPath: "/home/pi/waterdrop/deviceSide/certs/f824883ce9-private.pem.key",
    certPath: "/home/pi/waterdrop/deviceSide/certs/f824883ce9-certificate.pem.crt",
    caPath: "/home/pi/waterdrop/deviceSide/certs/root-CA.crt",
    clientId: "Orpheus",
    host: "a1o2i3ldawkuze.iot.us-east-2.amazonaws.com",
    region: "us-east-2"
});

console.log("start");


device.on("connect", function() {
    console.log('connect');
    device.subscribe("tempHumi");
});

pyshell.on('message', function (message) {
    // received a message sent from the Python script (a simple "print" statement)
    media = JSON.parse("{" + message + "}");
    //timestamp = Math.round(d.getTime()); //why timestamp is always same? if define d outside funciton.
    var d = new Date(); //why it does not cause memory issue?
    var highChartXaxisDate;
    timestamp = d.getTime();
    var dd = d.getDate();
    var mm = d.getMonth()+1; //January is 0!
    var yyyy = d.getFullYear();
    var hours = d.getHours();
    var minutes = d.getMinutes();
    var seconds = d.getSeconds();

    if(dd<10) {
        dd = '0'+dd
    }

    if(mm<10) {
        mm = '0'+mm
    }
    //
    // if(hours<10) {
    //     hours = '0'+hours
    // }
    //
    // if(minutes<10) {
    //     minutes = '0'+ minutes
    // }
    //
    // if(seconds<10) {
    //     seconds = '0'+ seconds
    // }

    d = mm + '-' + dd + '-' + yyyy;
    //highChartXaxisDate = yyyy + '-' + mm + '-' + dd + '-' + hours + '-' + minutes + '-' + seconds;
    //console.log(message + " timestamp in epoch: " + timestamp);
    console.log("PartitionKey: " + d + " temperature: " + media.Temp +
    " Humidity: " + media.Humidity + " Sort Key timestamp in epoch: " + timestamp);
    device.publish('tempHumi', JSON.stringify({
      date: d, temperature: media.Temp, humidity: media.Humidity, timestamp: timestamp
    }));
});

//console.log("after pyshell");
// end the input stream and allow the process to exit
pyshell.end(function (err) {
    if (err){
        throw err;
    };
    console.log('finished');
});

// device.on("message", function(topic, payload) {
//     var payload = JSON.parse(payload.toString());
//     //show the incoming message
//     console.log(payload.light);
//     if(topic == "LED"){
//         if(payload.light == "on"){
//           rpio.write(12, rpio.HIGH);
//         } else {
//           rpio.write(12, rpio.LOW);
//         }
//     }
// });
