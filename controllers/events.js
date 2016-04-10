var dateutil = require('../util/dateutil'),
	moment = require('moment');
var mongo = require('../models/mongo');
var eventful = require('eventful-node');
var client = new eventful.Client("v7Hh8fbDtq7S7C52");

getEvents = function(req, res){

	client.searchEvents({
		
		location : req.params.city+",US",
		date : 'This Week',
		within : 10,
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

exports.getEvents = getEvents;