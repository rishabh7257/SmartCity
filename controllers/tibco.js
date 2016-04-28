var dateutil = require('../util/dateutil'),
    moment = require('moment'),
    Forecast = require('forecast.io');
var mongo = require('../models/mongo');



var mongodb = require('mongodb');
var db = new mongodb.Db('smartcity', new mongodb.Server(
    'ds045704.mongolab.com', 45704, {
        auto_reconnect : true
    }), {});


function getMeanValue(data) {

    var strData = data.toString();
    var firstChar = strData.charAt(0);
    var secondChar = strData.charAt(2);
    var thirdChar = strData.charAt(3);
    var fourthChar = strData.charAt(4);
    var result;
    if(firstChar == ">"){
        var testStr = strData.slice(1);
        result = parseInt(testStr) + parseInt(testStr)/2;
    }else if(firstChar == "<") {
        var testStr = strData.slice(1);
        result = parseInt(testStr) - parseInt(testStr)/2;
    }else if(secondChar == "-" ) {
        var testStr = strData.slice(0,2);
        result = parseInt(testStr) + parseInt(testStr)/2;
    }else if(thirdChar == "-") {
        var testStr = strData.slice(0,3);
        result = parseInt(testStr) + parseInt(testStr)/2;
    }else if(fourthChar == "-") {
        var testStr = strData.slice(0,4);
        result = parseInt(testStr) + parseInt(testStr)/2;

    } else {
        result = data;
    }
    //console.log(t.chartAt(0));
    return result;
}

getPowerOutage = function(req,res) {
    console.log("Mean Value is "+ r);
    var db = mongo.getMongoConnection();
    //console.log(customerImpacted);
    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err, result) {
            var docs = "INTIAL DOCS";
            if (err) {
                throw err;
            } else
                var final = []
            //var temp = db.collection('power_outage').find().toArray(function(err, documents){
            db.collection('power_outage').aggregate([{$group : {	_id :"$CAUSE",sum: { $sum: "$CUSTOMERSIMPACTED" }}	}]).toArray(function(err,documents){
                var result ="";
                var yAxis = [];
                var xAxis = [];
                for(var i=0; i< documents.length; i++){
                    //	var meanVal = getMeanValue(documents[i].CUSTOMERSIMPACTED);
                    xAxis.push(documents[i]._id);
                    yAxis.push(documents[i].sum);

                }
                console.log("xAxis"+xAxis.length);
                console.log("yAxis"+yAxis);
                res.status(200).json({x:xAxis, y:yAxis});
            });
        });
    });

};

getOutagesByArea = function(req,res) {
    var db = mongo.getMongoConnection();
    console.log("Client getOutagesByArea");
    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err, result) {
            var docs = "INTIAL DOCS";
            if (err) {
                throw err;
            } else
            //var temp = db.collection('power_outage').aggregate([{$group : {_id : "$AREA", sum: { $sum: 1 }}}]);
            //console.log("Data is "+temp);
                var area = [];
            var count = [];
            var temp =  db.collection('power_outage').aggregate([{$group : {_id : "$AREA", sum: { $sum: 1 }}}]).toArray(function(err, documents){
                console.log("Data is "+documents)


                for(var i=0; i< documents.length; i++){
                    area.push(documents[i]._id);

                    count.push(documents[i].sum);
                    console.log("Areas"+count);

                }
                res.status(200).json({Area:area, Count:count});
            });

        });

    });

};

getOutagesByCause = function(req,res) {
    var db = mongo.getMongoConnection();
    console.log("Client getOutagesByArea");
    db.open(function (err, db) {
        db.authenticate('username', 'password', function (err, result) {
            var docs = "INTIAL DOCS";
            if (err) {
                throw err;
            } else
                var cause = [];
            var count = [];
            var temp =  db.collection('power_outage').aggregate([{$group : {_id : "$CAUSE", sum: { $sum: 1 }}}]).toArray(function(err, documents){
                //console.log("Data is "+documents);


                for(var i=0; i< documents.length; i++){
                    cause.push(documents[i]._id);

                    count.push(documents[i].sum);


                }
                res.status(200).json({Cause:cause, Count:count});
            });

        });

    });

};



exports.getPowerOutage = getPowerOutage;
exports.getOutagesByArea = getOutagesByArea;
exports.getOutagesByCause = getOutagesByCause;