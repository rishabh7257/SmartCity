var dateutil = require('../util/dateutil'),
	moment = require('moment'),
	Forecast = require('forecast.io');
var mongo = require('../models/mongo');


var mongodb = require('mongodb');
var db = new mongodb.Db('smartcity', new mongodb.Server(
		'ds045704.mongolab.com', 45704, {
			auto_reconnect : true
		}), {});


createClient = function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.body.idperson || !req.body.start_date || !req.body.end_date || !req.body.idclient){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		var formDate = moment(req.body.start_date,'DD-MM-YYYY').toDate();
		var toDate = moment(req.body.end_date,'DD-MM-YYYY').toDate();

		var queryParam = {
				idperson : req.body.idperson,
				start_date : formDate,
				end_date : toDate,
				idclient : req.body.idclient
		}

		mysql.queryDb("INSERT INTO client SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Client has been added Succesfully" });
			}
		});
	}
};

powerStatus = function(req,res) {
	console.log("inside powerStatus");
	mysql.queryDb("select alertinfo.thresholdLevel, alertinfo.date from alertinfo WHERE date between date_sub(CURDATE(), INTERVAL 7 day) and CURDATE()",function(err,rows){
	//mysql.queryDb("Select * from alertinfo",function(err,rows){
		console.log("Inside powerStatus");
		if (err) {
			res.status(500).json({ status : 500, message : "Error while retrieving data" });
		} else {
			console.log("Rows fetched");
			res.status(200).json({ status : 200, data: rows });
			}
		});
};

getClient=function(req,res){
	
	if(!req.params.idperson){
		res.status(400).json({ status : 400, message : "Bad Request" });
	}else{ 
		mysql.queryDb('SELECT * FROM client WHERE ?',[{idperson:req.params.idperson}],function(err,rows){

			if (err) {
				res.status(500).json({ status : 500, message : "Error while retrieving data" });
			} else {
				res.status(200).json({ status : 200, data : rows });
			}
		});
	}
};



getClientInfo=function(req,res){
	idperson = req.params.idperson;
mysql.queryDb('SELECT * FROM person WHERE ?',[{idperson:idperson}],function(err,rows){
	if (err) {
		console.log("Error while listing all the client details !!!"  + err);
		res.status(500).json({ status : 500, message : "Error while listing client details !!!" });
	} else {
		res.status(200).json({ status : 200, data : rows});
	}
});
};

getWeatherForecast = function(req,res) {
	
	var cityName = req.params.city;
	
	
}


getFutureWeather = function(req, res){

	var options = {
			APIKey: "d6fc86674f86842ceb0a9b550a0e8f28",
			timeout: 1000
	},
	forecast = new Forecast(options);

	forecast.get(37.766602,-122.45108, function (err, res, data) {
		if (err) {
			throw err;  
		}
		console.log(data);
		dumpIntoMongo(data);

	});
};

function dumpIntoMongo(data) {
	var db = mongo.getMongoConnection();
	
	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				throw err;
			} else {
				db.collection('future_weather', function(err, collection) {
					
					collection.insert(data, function(err, res) {
						if (err) {
							throw err;
						} else {
							console.log('inserted');
						}
						db.close();
					});
				});
			}
		});
	});
}

exports.getFutureWeather = getFutureWeather;

exports.powerStatus = powerStatus; 
exports.getClient = getClient;
exports.getClientInfo=getClientInfo;