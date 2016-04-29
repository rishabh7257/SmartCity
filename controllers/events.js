var dateutil = require('../util/dateutil'),
	moment = require('moment');
var mongo = require('../models/mongo');
var eventful = require('eventful-node');
var client = new eventful.Client("v7Hh8fbDtq7S7C52");



getEventsAroundUserEvents = function(req,res){
	var userID = req.session.idperson;
	var db = mongo.getMongoConnection();
	db.open(function(err,db) {
		db.authenticate('username', 'password', function (err, result) {
			if (err) {
				throw err;
			} else
			var temp =  db.collection('user_events').find({userId:userID}, {start_date:1}).toArray(function(err,documents){

				for (var j = 0; j < documents.length; j++) {
					console.log("Event Date"+ documents[j].start_date);
				}
				res.send(documents);
			});

		});
	});
};
getEventsByCity = function(req, res){

	client.searchEvents({
		location : req.params.city+",US",
		date : 'This Week',
		within : 3,
		units : 'mi',
		sort_order : 'popularity',
		include : 'price'
	}, function(err, data){
	  if(err){
		  res.status(500).json({ status : 500, message : "Error Message " + err });
	  }
	  res.status(200).json({ status : 200, data : data });
	});
};

getEventsByPostal = function(req,res) {
	client.searchEvents({
		location : req.params.postal,
		date : 'This Week',
		within : 3,
		units : 'mi',
		sort_order : 'popularity',
		include : 'price'
	}, function(err, data){
	  if(err){
		  res.status(500).json({ status : 500, message : "Error Message " + err });
	  }
	  res.status(200).json({ status : 200, data : data });
	});

};

exports.getEventsByPostal = getEventsByPostal;
exports.getEventsByCity = getEventsByCity;
exports.getEventsAroundUserEvents = getEventsAroundUserEvents;
