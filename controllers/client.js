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


createUserEvents = function(req,res) {
	var db = mongo.getMongoConnection();

	db.open(function (err, db) {
		db.authenticate('username', 'password', function (err) {
			if (err) {
				throw err;
			} else {
				db.collection('user_events', function (err, collection) {

					collection.insert(({
						text:"My test event A",
						start_date: new Date(2016,4,4),
						end_date:   new Date(2016,4,4)
					}), function (err, res) {
						if (err) {
							throw err;
						} else {
							console.log('inserted into user events');
						}
						db.close();
					});
				});
			}
		});
	});

}
powerStatus = function(req,res) {
	mysql.queryDb("select alertinfo.thresholdLevel, alertinfo.date from alertinfo WHERE date between date_sub(CURDATE(), INTERVAL 7 day) and CURDATE()",function(err,rows){

		if (err) {
			res.status(500).json({ status : 500, message : "Error while retrieving data" });
		} else {
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



getUserEvents = function(req,res) {
	var db = mongo.getMongoConnection();
	//console.log(customerImpacted);
	db.open(function (err, db) {
		db.authenticate('username', 'password', function (err, result) {
			var docs = "INTIAL DOCS";
			if (err) {
				throw err;
			} else {
				db.collection('user_events').find().toArray(function(err, data){
					//set id property for all records
					for (var i = 0; i < data.length; i++)
						data[i].id = data[i]._id;

					console.log("Events found" +data);
					res.send(data);
				});
			}

		});

	});

}


addUserEvents = function(req,res) {
	var data = req.body;
	var mode = data["!nativeeditor_status"];
	var sid = data.id;
	var tid = sid;

	delete data.id;
	delete data.gr_id;
	delete data["!nativeeditor_status"];


	function update_response(err, result){
		if (err)
			mode = "error";
		else if (mode == "inserted")
			tid = data._id;

		res.setHeader("Content-Type","text/xml");
		res.send("<data><action type='"+mode+"' sid='"+sid+"' tid='"+tid+"'/></data>");
	}

	if (mode == "updated")
		db.user_events.updateById( sid, data, update_response);
	else if (mode == "inserted")
		db.user_events.insert(data, update_response);
	else if (mode == "deleted")
		db.user_events.removeById( sid, update_response);
	else
		res.send("Not supported operation");
}



exports.getClient = getClient;
exports.getClientInfo=getClientInfo;
exports.createUserEvents=createUserEvents;
exports.getUserEvents = getUserEvents;
exports.addUserEvents = addUserEvents;

