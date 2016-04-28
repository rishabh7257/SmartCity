var dateutil = require('../util/dateutil'),
	moment = require('moment'),
	Forecast = require('forecast.io');
var mongo = require('../models/mongo');
var nodemailer = require('nodemailer');
var smtpTransport = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: 'notificationsforpoweroutage@gmail.com',
		pass: 'smartcity'
	}
});
var sinchSms = require('sinch-sms')({
	key: '54c1af62-92cc-4ea4-9001-ddbc9b7e01b0',
	secret: 'rM2QyCXbv0S8EqcOYhEpPg=='
});
var client = require('twilio')('ACe10877080547b663607bc260a5497f96','e881954b0748ab08c1521ec487155af6');

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


/*createUserEvents = function(req,res) {
	var db = mongo.getMongoConnection();

	db.open(function (err, db) {
		db.authenticate('username', 'password', function (err) {
			if (err) {
				throw err;
			} else {
				db.collection('user_events', function (err, collection) {
					console.log("User id is"+$rootScope.userId);
					collection.insert(({
						text:"My test event A",
						start_date: new Date(2016,4,4),
						end_date:   new Date(2016,4,4),
						user_id: 01
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

}*/
powerStatus = function(req,res) {
	console.log("User type in client"+req.session.type);

	mysql.queryDb("select alertinfo.thresholdLevel, alertinfo.date from alertinfo WHERE date between date_sub(CURDATE(), INTERVAL 7 day) and CURDATE()",function(err,rows){

		if (err) {
			res.status(500).json({ status : 500, message : "Error while retrieving data" });
		} else {
			//console.log(rows);
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

sendMail = function(req,res){
	console.log("Inside sendMail");
	var maillist = [
		'er.poojashukla07@gmail.com',
		'pooja.shukla@sjsu.edu'
	];
	mysql.queryDb('SELECT DISTINCT phonenumber from login l join person p WHERE ?',[{type:req.session.type}],function(err,rows){
	if (err) {
			console.log("Error while listing all phonenumbers !!!"  + err);
		} else {

		var msgList = [];
		rows.forEach(function(t,j, array){
			sinchSms.send(t.phonenumber, 'Alert !! Power Outage predicted in your area tomorrow!').then(function(response) {
				//All good, response contains messageId
				console.log(response);
			}).fail(function(error) {
				// Some type of error, see error object
				console.log(error);
			});
		});
		}
	});



	maillist.forEach(function (to, i, array) {
		msg.to = to;
		smtpTransport.sendMail(msg, function (err) {
			if (err) {
				console.log('Sending to ' + to + ' failed: ' + err);
				return;
			} else {
				console.log('Sent to ' + to);
			}
		});
	});
};

getWeatherForecast = function(req,res) {

	var cityName = req.params.city;

}


sendSms = function(req,res){
	client.sendMessage({
		to: '+16692219847',
		from: '4693314288',
		body: 'Hello from Twilio'
	},function(err, data){
		if(err)
			console.log(err);
		console.log(data);
	});
};

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
exports.getUserEvents = getUserEvents;
exports.addUserEvents = addUserEvents;
exports.powerStatus = powerStatus;
exports.sendMail = sendMail;
