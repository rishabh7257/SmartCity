var exec = require('child_process').exec;
var spawn = require('child_process').spawn,
    child;
var request = require('request');
var json2csv = require('json2csv');
var fs = require('fs');
runRScripts = function(req, res) {

    var rScript = "R CMD BATCH " + __dirname + "/../RScripts/CrossValidation_Script.R " + __dirname + "/../RScripts/output.txt"
    console.log(rScript)
    child = exec(rScript, function(error, stdout, stderr) {
        if (error) {
            res.status(500).json({
                status: 500,
                message: error
            });
        } else {
            var filename = __dirname + "/../RScripts/newOutput.txt"
            fs.readFile(filename, 'utf8', function(err, data) {
                if (err) {
                    res.status(500).json({
                        status: 500,
                        message: error
                    });
                } else {
                    console.log('OK: ' + filename + 'Read Successfully from R CMD');
                    res.status(200).json({
                        status: 200,
                        message: data
                    });
                }
            });
        }
    });
}
readTextFile = function(req, res) {
    var fileName = __dirname + "/../RScripts/" + req.params.filename + ".txt";
    console.log(fileName)
    fs.readFile(fileName, 'utf8', function(err, data) {
        if (err) {
            res.status(500).json({
                status: 500,
                message: error
            });
        } else {
            var result = data.split('\n').map(function(n) {
                return Number(n);
            });
            console.log(result);
            res.status(200).json({
                status: 200,
                message: result
            })
        }
    });
};
getFutureWeather = function(req, res) {
    var city = decodeURI(req.body.city).toLowerCase().replace(" ", "_");
    var country = req.body.country;
    var equipment_failure = req.body.equipment_failure
    var futureDataDays = 1
    if (!equipment_failure) {
        equipment_failure = 0.5
        futureDataDays = 7
    }
    var path = "http://api.openweathermap.org/data/2.5/forecast?q=" + city + "," + country + "&appid=469b11f73c72546cbbbb001be0930dd2&units=metric";
    request(path, function(error, response, body) {
        //Check for error
        if (error) {
            return console.log('Error:', error);
        }
        //Check for right status code
        if (response.statusCode !== 200) {
            return console.log('Invalid Status Code Returned:', response.statusCode);
        }
        //All is good. Print the body
        var weather = JSON.parse(body);
        var futureWeekData = []
        if (weather) {
            for (var i = 0; i < futureDataDays; i++) {
                var wind = weather.list[i]["wind"]["speed"];
                var windspeedslow = 0,
                    windspeedcalm = 0,
                    windspeedhigh = 0,
                    windspeedveryhigh = 0;
                if (wind < 3) {
                    windspeedslow = 1;
                } else if (wind >= 3 && wind < 6) {
                    windspeedcalm = 1;
                } else if (wind >= 6 && wind < 12) {
                    windspeedhigh = 1;
                } else {
                    windspeedveryhigh = 1
                }
                var lightrain = 0,
                    mostlycloudy = 0,
                    heavyrain = 0,
                    scatteredclouds = 0,
                    clearclouds = 0;
                var desc = weather.list[i]["weather"]["description"];
                if (desc == "clear sky") {
                    clearclouds = 1;
                } else if (desc == "scattered clouds") {
                    scatteredclouds = 1;
                } else if (desc == "light rain") {
                    lightrain = 1;
                } else if (desc == "broken clouds") {
                    mostlycloudy = 1;
                } else if (desc == "heavy rain") {
                    heavyrain = 1;
                }
                var futureData = {
                    "temp": weather.list[i]["main"]["temp"],
                    "dew_pot": 57,
                    "humidity": weather.list[i]["main"]["humidity"],
                    "pressure": 29.89,
                    "visibility": 10,
                    "windspeedslow": windspeedslow,
                    "windspeedcalm": windspeedcalm,
                    "windspeedhigh": windspeedhigh,
                    "windspeedveryhigh": windspeedveryhigh,
                    "lightrain": lightrain,
                    "mostlycloudy": mostlycloudy,
                    "heavyrain": heavyrain,
                    "scatteredclouds": scatteredclouds,
                    "clearclouds": clearclouds,
                    "equipment_failure": equipment_failure,
                    "power_outage": 0.0
                }
                futureWeekData.push(futureData);
            }
        }
        //Dumping Into CSV file.
        var fields = ["temp", "dew_pot", "humidity", "pressure", "visibility", "windspeedslow", "windspeedcalm", "windspeedhigh", "windspeedveryhigh", "lightrain", "mostlycloudy", "heavyrain", "scatteredclouds", "clearclouds", "equipment_failure", "power_outage"];
        json2csv({
            data: futureWeekData,
            fields: fields
        }, function(err, csv) {
            if (err) console.log(err);
            var filename = __dirname + "/../RScripts/test.csv"
            fs.writeFile(filename, csv, function(err) {
                if (err) throw err;
                console.log('file saved');
                res.status(200).json({
                    status: 200,
                    result: futureWeekData
                });
            });
        });
    });
};
exports.readTextFile = readTextFile;
exports.getFutureWeather = getFutureWeather;
exports.runRScripts = runRScripts;