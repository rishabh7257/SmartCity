var dateutil = require('../util/dateutil'),
	moment = require('moment');

createAlert = function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.body.idalert || !req.body.heading || !req.body.description ){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		
		var queryParam = {
				idalert : req.body.idalert,
				heading : req.body.heading,
				description : req.body.description
				
		}

		mysql.queryDb("INSERT INTO alert SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Alert has been added Succesfully" });
			}
		});
	}
};

publishAlert = function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.body.idguard || !req.body.idalert || !req.severity || !req.body.date){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		
		var queryParam = {
				idguard : req.body.idguard,
				idalert : req.body.idalert,
				severity : req.body.severity,
				date : req.body.date
				
		}

		mysql.queryDb("INSERT INTO alertinfo SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Alert has been added Succesfully" });
			}
		});
	}
};


/*alertByBuilding = function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.body.idalert || !req.body.heading || !req.body.description ){
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		
		var queryParam = {
				idalert : req.body.idalert,
				heading : req.body.heading,
				description : req.body.description
				
		}

		mysql.queryDb("INSERT INTO alert SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Alert has been added Succesfully" });
			}
		});
	}
};*/

addPatrolRecord = function(req,res){
	console.log(JSON.stringify(req.body));
	if(!req.body.date || !req.body.description|| !req.body.idgaurd || !req.body.idbuilding || !req.body.idreport){
		
		res.status(400).json({status : 400, message : "Bad Request"});
	}else{
		
		var queryParam = {
				date    : req.body.date,
				description : req.body.description,
				idgaurd   : req.body.idgaurd,
				idbuilding : req.body.idgaurd,
				idreport : req.body.idreport
				
				
		}

		mysql.queryDb("INSERT INTO patrol SET ?", queryParam, function(err, response) {
			if (err) {
				console.log("Error while perfoming query !!!");
				res.status(500).json({ status : 500, message : "Please try again later" });
			} else {
				res.status(200).json({ status : 200, message : "Patrol record has been added Succesfully" });
			}
		});
	}
};

exports.createAlert=createAlert;
exports.publishAlert=publishAlert;
exports.addPatrolRecord=addPatrolRecord;
