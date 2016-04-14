var dateutil = require('../util/dateutil'),
moment = require('moment');
var mongo = require('../models/mongo');

getLongLat = function(req, res){

	var db = mongo.getMongoConnection();

	db.open(function(err, db) {
		db.authenticate('username', 'password', function(err) {
			if (err) {
				res.status(500).json({ status : 500, message : "Error while connection to mongo database" });
			} else {
				var cursor = db.collection('city_list').find({
					"name": req.params.city 
				});
				console.log(cursor);
				cursor.each(function(err, doc) {
					if (err) {
						res.status(500).json({ status : 500, message : "Error Message " + err });
					}
					if (doc != null) {
						res.status(200).json({ status : 200, data : doc });
					} else {
						res.status(200).json({ status : 400, data : doc });
					}
				});
			}
		});
	});
};

getTime = function(req,res) {

	var time = moment(req.params.dateTime).format('H:m');
	console.log("Date" + time);
	if (time) {
		res.status(200).json({ status : 200, data : time});	
	} else {
		res.status(500).json({ status : 500, message : "Error Message " });
	}
}

getDate = function(req,res) {

	var date = moment(req.params.dateTime).format('YYYY MM DD');
	console.log("Date" + date);
	if (moment(date).isValid()) {
		res.status(200).json({ status : 200, data : date});

	} else {
		res.status(500).json({ status : 500, message : "Error Message "});
	}

}

exports.getTime = getTime;
exports.getDate = getDate;
exports.getLongLat = getLongLat;